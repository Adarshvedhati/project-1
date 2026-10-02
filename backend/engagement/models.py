from django.conf import settings
from django.db import models
from django.utils import timezone


class Alert(models.Model):
    """FR-09 notifications / saved-search alerts."""

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="alerts")
    message = models.CharField(max_length=400)
    created_at = models.DateTimeField(default=timezone.now, db_index=True)
    read = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]


class Bookmark(models.Model):
    """FR-09 reading list."""

    TYPES = [("article", "Article"), ("journal", "Journal"), ("book", "Book"), ("case_study", "Case study")]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="bookmarks")
    content_id = models.CharField(max_length=40)
    content_type = models.CharField(max_length=20, choices=TYPES)
    title = models.CharField(max_length=500)
    saved_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ["-saved_at"]
        unique_together = [("user", "content_type", "content_id")]


class Subscription(models.Model):
    """FR-10 institutional journal subscription."""

    PLANS = [("full-text", "Full text"), ("abstract-only", "Abstract only")]

    institution = models.ForeignKey("accounts.Institution", on_delete=models.CASCADE, related_name="subscriptions")
    journal = models.ForeignKey("catalog.Journal", on_delete=models.CASCADE, related_name="subscriptions")
    plan = models.CharField(max_length=20, choices=PLANS, default="full-text")
    renewal_date = models.DateField()

    class Meta:
        ordering = ["journal__title"]
        unique_together = [("institution", "journal")]


class UsageStat(models.Model):
    """Monthly download counts powering the institutional usage chart."""

    institution = models.ForeignKey("accounts.Institution", on_delete=models.CASCADE, related_name="usage")
    month = models.DateField(help_text="First day of the month.")
    downloads = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["month"]
        unique_together = [("institution", "month")]
