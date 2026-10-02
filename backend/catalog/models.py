from django.db import models
from django.utils import timezone

from core import ids

ACCESS_TYPES = [("open_access", "Open access"), ("subscription", "Subscription"), ("free_preview", "Free preview")]


class Journal(models.Model):
    id = models.CharField(primary_key=True, max_length=40, default=ids.journal_id)
    title = models.CharField(max_length=300)
    issn = models.CharField(max_length=20, blank=True)
    scope = models.TextField(blank=True)
    subject = models.CharField(max_length=100, db_index=True)
    access_type = models.CharField(max_length=20, choices=ACCESS_TYPES, default="subscription")
    latest_volume = models.CharField(max_length=60, blank=True)
    established = models.DateField(default=timezone.localdate)

    class Meta:
        ordering = ["title"]

    def __str__(self):
        return self.title


class Article(models.Model):
    id = models.CharField(primary_key=True, max_length=40, default=ids.article_id)
    journal = models.ForeignKey(Journal, on_delete=models.CASCADE, related_name="articles")
    title = models.CharField(max_length=500)
    authors = models.JSONField(default=list, help_text="List of author display names.")
    summary = models.TextField(help_text="Abstract.")
    subject = models.CharField(max_length=100, db_index=True)
    publication_date = models.DateField(default=timezone.localdate, db_index=True)
    access_type = models.CharField(max_length=20, choices=ACCESS_TYPES, default="subscription")
    doi = models.CharField(max_length=120, blank=True)
    citation_count = models.PositiveIntegerField(default=0)
    keywords = models.JSONField(default=list, blank=True)
    full_text_available = models.BooleanField(default=False)

    class Meta:
        ordering = ["-publication_date"]

    def __str__(self):
        return self.title


class Book(models.Model):
    id = models.CharField(primary_key=True, max_length=40, default=ids.book_id)
    title = models.CharField(max_length=500)
    authors = models.JSONField(default=list)
    summary = models.TextField()
    subject = models.CharField(max_length=100, db_index=True)
    publication_date = models.DateField(default=timezone.localdate, db_index=True)
    access_type = models.CharField(max_length=20, choices=ACCESS_TYPES, default="subscription")
    isbn = models.CharField(max_length=20, blank=True)

    class Meta:
        ordering = ["-publication_date"]

    def __str__(self):
        return self.title


class Chapter(models.Model):
    id = models.CharField(primary_key=True, max_length=60)
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="chapters")
    title = models.CharField(max_length=500)
    authors = models.JSONField(default=list)
    position = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["book_id", "position"]

    def __str__(self):
        return self.title


class CaseStudy(models.Model):
    id = models.CharField(primary_key=True, max_length=40, default=ids.case_study_id)
    title = models.CharField(max_length=500)
    authors = models.JSONField(default=list)
    summary = models.TextField()
    subject = models.CharField(max_length=100, db_index=True)
    publication_date = models.DateField(default=timezone.localdate, db_index=True)
    access_type = models.CharField(max_length=20, choices=ACCESS_TYPES, default="subscription")
    learning_objectives = models.JSONField(default=list, blank=True)
    instructor_resources_available = models.BooleanField(default=False)

    class Meta:
        ordering = ["-publication_date"]
        verbose_name_plural = "case studies"

    def __str__(self):
        return self.title
