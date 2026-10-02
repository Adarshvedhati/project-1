import re
from datetime import timedelta

from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import User, log_action
from catalog.models import Article, Journal
from core.permissions import has_any_role, user_roles
from engagement.models import Alert

from .models import EditorialDecisionRecord, ReviewAssignment, Submission
from .serializers import (
    DecisionSerializer,
    ReviewAssignmentCreateSerializer,
    ReviewAssignmentSerializer,
    ReviewStatusSerializer,
    SubmissionCreateSerializer,
    SubmissionSerializer,
)

STAFF = {"editor", "admin"}

# decision -> (resulting status, statuses it may be applied from)
DECISION_RULES = {
    "desk_reject": ("rejected", {"submitted"}),
    "revise": ("revision_requested", {"submitted", "under_review"}),
    "accept": ("accepted", {"submitted", "under_review", "revision_requested"}),
    "reject": ("rejected", {"submitted", "under_review", "revision_requested"}),
    "withdraw": ("withdrawn", {"draft", "submitted", "under_review", "revision_requested", "accepted"}),
    "publish": ("published", {"accepted"}),
}

DECISION_VERBS = {
    "desk_reject": "desk-rejected", "revise": "returned for revision", "accept": "accepted",
    "reject": "rejected", "withdraw": "withdrawn", "publish": "published",
}


def _is_staff(user) -> bool:
    return bool(user_roles(user) & STAFF)


class SubmissionListCreate(APIView):
    """GET: `?scope=mine` (always own) or, for editors/admins, the whole queue. POST: new submission."""

    def get_permissions(self):
        return [has_any_role("author", "researcher", "editor", "admin")()]

    def get(self, request):
        qs = Submission.objects.select_related("author", "journal")
        if request.query_params.get("scope") == "mine" or not _is_staff(request.user):
            qs = qs.filter(author=request.user)
        else:
            qs = qs.exclude(status__in=["draft"])
        return Response(SubmissionSerializer(qs, many=True).data)

    def post(self, request):
        serializer = SubmissionCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        journal = None
        if data["contentType"] == "article":
            journal = Journal.objects.filter(pk=data["targetJournalId"]).first()
            if journal is None:
                return Response({"detail": "Unknown journal."}, status=status.HTTP_400_BAD_REQUEST)
        submission = Submission.objects.create(
            author=request.user, title=data["title"].strip(), abstract=data["abstract"],
            content_type=data["contentType"], journal=journal, author_names=data["authorNames"].strip(),
            status="submitted",
        )
        log_action(request.user, "Submitted manuscript", submission.id)
        return Response({"id": submission.id}, status=status.HTTP_201_CREATED)


class SubmissionDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        submission = get_object_or_404(Submission.objects.select_related("author", "journal"), pk=pk)
        if submission.author_id != request.user.pk and not _is_staff(request.user):
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(SubmissionSerializer(submission).data)


def _publish_article(submission: Submission) -> Article | None:
    if submission.content_type != "article" or not submission.journal_id or submission.published_article_id:
        return submission.published_article
    journal = submission.journal
    names = [n.strip() for n in re.split(r"[;,]", submission.author_names) if n.strip()] or [submission.author.display_name]
    article = Article.objects.create(
        journal=journal, title=submission.title, authors=names, summary=submission.abstract or submission.title,
        subject=journal.subject, access_type=journal.access_type, full_text_available=journal.access_type != "subscription",
    )
    submission.published_article = article
    return article


class EditorialDecisionCreate(APIView):
    """FR-08: record an editorial decision and move the submission along."""

    permission_classes = [has_any_role("editor", "admin")]

    @transaction.atomic
    def post(self, request):
        serializer = DecisionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        submission = get_object_or_404(Submission.objects.select_for_update().select_related("author", "journal"),
                                       pk=data["submissionId"])
        new_status, allowed_from = DECISION_RULES[data["decision"]]
        if submission.status not in allowed_from:
            return Response(
                {"detail": f"Cannot apply '{data['decision']}' to a submission that is {submission.status.replace('_', ' ')}."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        submission.set_status(new_status)
        submission.last_decision = data["decision"]
        if data["decision"] == "publish":
            _publish_article(submission)
        submission.save()
        EditorialDecisionRecord.objects.create(submission=submission, editor=request.user,
                                               decision=data["decision"], comments=data["comments"])
        verb = DECISION_VERBS[data["decision"]]
        Alert.objects.create(user=submission.author, message=f"Your submission “{submission.title}” was {verb}.")
        log_action(request.user, f"Recorded editorial decision ({data['decision']})", submission.id)
        return Response(SubmissionSerializer(submission).data, status=status.HTTP_201_CREATED)


class ReviewAssignmentListCreate(APIView):
    def get_permissions(self):
        roles = ("editor", "admin") if self.request.method == "POST" else ("reviewer", "editor", "admin")
        return [has_any_role(*roles)()]

    def get(self, request):
        qs = ReviewAssignment.objects.select_related("submission", "submission__journal", "reviewer")
        if request.query_params.get("scope") == "mine" or not _is_staff(request.user):
            qs = qs.filter(reviewer=request.user)
        return Response(ReviewAssignmentSerializer(qs, many=True).data)

    @transaction.atomic
    def post(self, request):
        serializer = ReviewAssignmentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        submission = get_object_or_404(Submission, pk=data["submissionId"])
        reviewer = User.objects.filter(email__iexact=data["reviewerEmail"]).first()
        if reviewer is None or "reviewer" not in reviewer.effective_roles:
            return Response({"detail": "No reviewer account found for that email."}, status=status.HTTP_400_BAD_REQUEST)
        if ReviewAssignment.objects.filter(submission=submission, reviewer=reviewer).exists():
            return Response({"detail": "That reviewer is already assigned."}, status=status.HTTP_400_BAD_REQUEST)
        assignment = ReviewAssignment.objects.create(
            submission=submission, reviewer=reviewer,
            due_date=data.get("dueDate") or (timezone.localdate() + timedelta(days=21)),
        )
        if submission.status == "submitted":
            submission.set_status("under_review")
            submission.save()
        Alert.objects.create(user=reviewer, message=f"You were invited to review “{submission.title}”.")
        log_action(request.user, f"Assigned reviewer {reviewer.email}", submission.id)
        return Response(ReviewAssignmentSerializer(assignment).data, status=status.HTTP_201_CREATED)


class ReviewAssignmentDetail(APIView):
    permission_classes = [has_any_role("reviewer", "editor", "admin")]

    TRANSITIONS = {"accepted": {"invited"}, "declined": {"invited", "accepted"}, "submitted": {"accepted"}}

    def patch(self, request, pk):
        assignment = get_object_or_404(ReviewAssignment.objects.select_related("submission"), pk=pk)
        if assignment.reviewer_id != request.user.pk and not _is_staff(request.user):
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = ReviewStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        new_status = serializer.validated_data["status"]
        if assignment.status not in self.TRANSITIONS[new_status]:
            return Response({"detail": f"Cannot change a {assignment.status} review to {new_status}."},
                            status=status.HTTP_400_BAD_REQUEST)
        assignment.status = new_status
        assignment.save(update_fields=["status"])
        log_action(request.user, f"Review {new_status}", assignment.submission_id)
        return Response(ReviewAssignmentSerializer(assignment).data)
