import uuid

from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils import timezone

ROLE_CHOICES = ["visitor", "researcher", "author", "reviewer", "editor", "librarian", "admin"]
SELF_SERVICE_ROLES = ["researcher", "author"]


class Institution(models.Model):
    TYPES = [("institution", "Institution"), ("library", "Library"), ("publisher", "Publisher"), ("funder", "Funder")]

    name = models.CharField(max_length=200, unique=True)
    type = models.CharField(max_length=20, choices=TYPES, default="institution")
    country = models.CharField(max_length=80, blank=True)

    def __str__(self):
        return self.name


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create(self, email, password, **extra):
        if not email:
            raise ValueError("An email address is required.")
        user = self.model(email=self.normalize_email(email).lower(), **extra)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra):
        extra.setdefault("is_staff", False)
        extra.setdefault("is_superuser", False)
        extra.setdefault("roles", ["researcher"])
        return self._create(email, password, **extra)

    def create_superuser(self, email, password=None, **extra):
        extra.setdefault("is_staff", True)
        extra.setdefault("is_superuser", True)
        extra.setdefault("roles", ["admin"])
        return self._create(email, password, **extra)


class User(AbstractUser):
    STATUSES = [("active", "Active"), ("invited", "Invited"), ("suspended", "Suspended")]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = None
    email = models.EmailField(unique=True)
    roles = models.JSONField(default=list, blank=True, help_text="List of roles, e.g. ['author', 'reviewer'].")
    status = models.CharField(max_length=12, choices=STATUSES, default="active")
    affiliation = models.CharField(max_length=200, blank=True)
    orcid = models.CharField(max_length=40, blank=True)
    institution = models.ForeignKey(Institution, null=True, blank=True, on_delete=models.SET_NULL, related_name="users")

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]
    objects = UserManager()

    @property
    def effective_roles(self) -> list[str]:
        roles = [r for r in (self.roles or []) if r in ROLE_CHOICES]
        if self.is_superuser and "admin" not in roles:
            roles.append("admin")
        return roles

    @property
    def display_name(self) -> str:
        return f"{self.first_name} {self.last_name}".strip() or self.email

    def save(self, *args, **kwargs):
        self.email = (self.email or "").lower()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.email


class AuditLog(models.Model):
    actor = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name="+")
    actor_name = models.CharField(max_length=200, default="System")
    action = models.CharField(max_length=300)
    target = models.CharField(max_length=100, blank=True)
    timestamp = models.DateTimeField(default=timezone.now, db_index=True)

    class Meta:
        ordering = ["-timestamp"]

    def __str__(self):
        return f"{self.actor_name}: {self.action}"


def log_action(actor, action: str, target: str = "") -> AuditLog:
    """Record an entry in the admin audit trail (FR-11)."""
    return AuditLog.objects.create(
        actor=actor if actor is not None and getattr(actor, "is_authenticated", False) else None,
        actor_name=actor.display_name if actor is not None and getattr(actor, "is_authenticated", False) else "System",
        action=action,
        target=target,
    )
