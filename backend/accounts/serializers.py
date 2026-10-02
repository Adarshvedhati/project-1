from django.contrib.auth import password_validation
from rest_framework import serializers

from .models import SELF_SERVICE_ROLES, AuditLog, User


class UserSerializer(serializers.ModelSerializer):
    """Matches the frontend `User` type."""

    firstName = serializers.CharField(source="first_name")
    lastName = serializers.CharField(source="last_name")
    roles = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "email", "firstName", "lastName", "roles", "status", "affiliation", "orcid"]

    def get_roles(self, obj):
        return obj.effective_roles

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["id"] = str(instance.id)
        return {k: v for k, v in data.items() if v not in ("",) or k in {"firstName", "lastName"}}


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, trim_whitespace=False)
    firstName = serializers.CharField(max_length=150)
    lastName = serializers.CharField(max_length=150)
    role = serializers.ChoiceField(choices=SELF_SERVICE_ROLES, default="researcher")

    def validate_email(self, value):
        value = value.lower()
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value

    def validate(self, attrs):
        probe = User(email=attrs["email"], first_name=attrs["firstName"], last_name=attrs["lastName"])
        try:
            password_validation.validate_password(attrs["password"], probe)
        except Exception as exc:  # django ValidationError -> DRF
            raise serializers.ValidationError({"password": list(getattr(exc, "messages", [str(exc)]))})
        return attrs

    def create(self, validated):
        roles = ["researcher"] if validated["role"] == "researcher" else ["researcher", "author"]
        return User.objects.create_user(
            email=validated["email"],
            password=validated["password"],
            first_name=validated["firstName"],
            last_name=validated["lastName"],
            roles=roles,
        )


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, trim_whitespace=False)


class AdminUserRowSerializer(serializers.ModelSerializer):
    """Matches the frontend `AdminUserRow` type."""

    name = serializers.CharField(source="display_name", read_only=True)
    roles = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "name", "email", "roles", "status"]

    def get_roles(self, obj):
        return obj.effective_roles

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["id"] = str(instance.id)
        return data


class AdminUserUpdateSerializer(serializers.Serializer):
    roles = serializers.ListField(child=serializers.ChoiceField(choices=[
        "visitor", "researcher", "author", "reviewer", "editor", "librarian", "admin"]), required=False)
    status = serializers.ChoiceField(choices=["active", "invited", "suspended"], required=False)


class AuditLogSerializer(serializers.ModelSerializer):
    actor = serializers.CharField(source="actor_name")
    id = serializers.SerializerMethodField()

    class Meta:
        model = AuditLog
        fields = ["id", "actor", "action", "target", "timestamp"]

    def get_id(self, obj):
        return f"log-{obj.pk}"
