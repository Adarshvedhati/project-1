from django.conf import settings
from django.db import models
from django.utils import timezone

from core import ids

SUBMISSION_STATUSES = [
    ("draft", "Draft"), ("submitted", "Submitted"), ("under_review", "Under review"),
    ("revision_requested", "Revision requested"), ("accepted", "Accepted"), ("rejected", "Rejected"),
    ("withdrawn", "Withdrawn"), ("published", "Published"),
]
CONTENT_TYPES = [("article", "Journal article"), ("book_proposal", "Book proposal"), ("case_study", "Case study")]
DECISIONS = [
    ("desk_reject", "Desk reject"), ("revise", "Request revision"), ("accept", "Accept"),
    ("reject", "Reject"), ("withdraw", "Withdraw"), ("publish", "Publish"),
]


class Submission(models.Model):
    """FR-06 submission workflow (SRS 4.5)."""

    id = models.CharField(primary_key=True, max_length=40, default=ids.submission_id)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="submissions")
    title = models.CharField(max_length=500)
    abstract = models.TextField(blank=True)
    content_type = models.CharField(max_length=20, choices=CONTENT_TYPES, default="article")
    journal = models.ForeignKey("catalog.Journal", null=True, blank=True, on_delete=models.SET_NULL, related_name="submissions")
    author_names = models.CharField(max_length=500, blank=True, help_text="Comma separated author list as typed in the form.")
    status = models.CharField(max_length=20, choices=SUBMISSION_STATUSES, default="submitted", db_index=True)
    last_decision = models.CharField(max_length=20, choices=DECISIONS, blank=True)
    submitted_at = models.DateTimeField(default=timezone.now)
    status_changed_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    published_article = models.OneToOneField("catalog.Article", null=True, blank=True, on_delete=models.SET_NULL, related_name="source_submission")

    class Meta:
        ordering = ["-updated_at"]

    def __str__(self):
        return f"{self.id}: {self.title}"

    @property
    def venue(self) -> str:
        if self.journal_id:
            return self.journal.title
        return {"book_proposal": "Book proposals", "case_study": "Case study collection"}.get(self.content_type, "")

    def set_status(self, status: str):
        self.status = status
        self.status_changed_at = timezone.now()


class EditorialDecisionRecord(models.Model):
    """FR-08 editorial decision log."""

    submission = models.ForeignKey(Submission, on_delete=models.CASCADE, related_name="decisions")
    editor = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, on_delete=models.SET_NULL, related_name="+")
    decision = models.CharField(max_length=20, choices=DECISIONS)
    comments = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ["-created_at"]


class ReviewAssignment(models.Model):
    """FR-07 peer review workflow."""

    STATUSES = [("invited", "Invited"), ("accepted", "Accepted"), ("declined", "Declined"), ("submitted", "Submitted")]

    id = models.CharField(primary_key=True, max_length=40, default=ids.review_id)
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE, related_name="review_assignments")
    reviewer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="review_assignments")
    due_date = models.DateField()
    status = models.CharField(max_length=12, choices=STATUSES, default="invited")
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ["due_date"]
        unique_together = [("submission", "reviewer")]
