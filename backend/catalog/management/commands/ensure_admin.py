import os

from django.core.management.base import BaseCommand, CommandError

from accounts.models import User


class Command(BaseCommand):
    help = "Create (or update) the first administrator from ADMIN_EMAIL / ADMIN_PASSWORD env vars."

    def handle(self, *args, **options):
        email = os.environ.get("ADMIN_EMAIL", "").strip().lower()
        password = os.environ.get("ADMIN_PASSWORD", "")
        if not email or not password:
            self.stdout.write("ADMIN_EMAIL / ADMIN_PASSWORD not set - skipping admin bootstrap.")
            return
        if len(password) < 8:
            raise CommandError("ADMIN_PASSWORD must be at least 8 characters.")
        user, created = User.objects.get_or_create(
            email=email,
            defaults={"first_name": "Site", "last_name": "Admin", "is_staff": True, "is_superuser": True, "roles": ["admin"]},
        )
        if created:
            user.set_password(password)
            user.save()
            self.stdout.write(self.style.SUCCESS(f"Created administrator {email}"))
        else:
            self.stdout.write(f"Administrator {email} already exists - password left unchanged.")
