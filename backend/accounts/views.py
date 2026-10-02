from django.contrib.auth import authenticate
from rest_framework import generics, status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.permissions import has_any_role

from .models import AuditLog, User, log_action
from .serializers import (
    AdminUserRowSerializer,
    AdminUserUpdateSerializer,
    AuditLogSerializer,
    LoginSerializer,
    RegisterSerializer,
    UserSerializer,
)


def _session(user: User) -> dict:
    token, _ = Token.objects.get_or_create(user=user)
    return {"user": UserSerializer(user).data, "token": token.key}


class RegisterView(APIView):
    """FR-01 registration (researchers and authors only)."""

    permission_classes = [AllowAny]
    authentication_classes: list = []
    throttle_scope = "auth"

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        log_action(user, "Registered account", str(user.id))
        return Response(_session(user), status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes: list = []
    throttle_scope = "auth"

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = authenticate(request, username=serializer.validated_data["email"].lower(),
                            password=serializer.validated_data["password"])
        if user is None:
            return Response({"detail": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED)
        if user.status == "suspended":
            return Response({"detail": "This account has been suspended."}, status=status.HTTP_403_FORBIDDEN)
        return Response(_session(user))


class LogoutView(APIView):
    def post(self, request):
        Token.objects.filter(user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class AdminUserListView(generics.ListAPIView):
    permission_classes = [has_any_role("admin")]
    serializer_class = AdminUserRowSerializer
    queryset = User.objects.order_by("first_name", "last_name", "email")


class AdminUserDetailView(APIView):
    permission_classes = [has_any_role("admin")]

    def patch(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except (User.DoesNotExist, ValueError):
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = AdminUserUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        if user.pk == request.user.pk and (data.get("status") == "suspended" or
                                           ("roles" in data and "admin" not in data["roles"] and not user.is_superuser)):
            return Response({"detail": "You cannot lock yourself out of the admin role."}, status=status.HTTP_400_BAD_REQUEST)
        if "roles" in data:
            user.roles = data["roles"]
        if "status" in data:
            user.status = data["status"]
            user.is_active = data["status"] != "suspended"
        user.save()
        log_action(request.user, f"Updated user ({', '.join(data.keys())})", user.email)
        return Response(AdminUserRowSerializer(user).data)


class AuditLogListView(generics.ListAPIView):
    permission_classes = [has_any_role("admin")]
    serializer_class = AuditLogSerializer

    def get_queryset(self):
        return AuditLog.objects.all()[:200]
