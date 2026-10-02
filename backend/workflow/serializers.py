from django.utils import timezone
from rest_framework import serializers

from .models import CONTENT_TYPES, ReviewAssignment, Submission


class SubmissionSerializer(serializers.ModelSerializer):
    """One shape serving both the author's `SubmissionSummary` and the editor's `EditorialQueueItem`."""

    contentType = serializers.CharField(source="content_type")
    journalOrSeries = serializers.CharField(source="venue")
    journal = serializers.CharField(source="venue")
    submittedAt = serializers.SerializerMethodField()
    lastUpdatedAt = serializers.SerializerMethodField()
    authorName = serializers.SerializerMethodField()
    daysInStage = serializers.SerializerMethodField()

    class Meta:
        model = Submission
        fields = ["id", "title", "contentType", "journalOrSeries", "journal", "status", "submittedAt",
                  "lastUpdatedAt", "authorName", "daysInStage"]

    def get_submittedAt(self, obj):
        return obj.submitted_at.date().isoformat()

    def get_lastUpdatedAt(self, obj):
        return obj.updated_at.date().isoformat()

    def get_authorName(self, obj):
        return obj.author_names or obj.author.display_name

    def get_daysInStage(self, obj):
        return max((timezone.now() - obj.status_changed_at).days, 0)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.last_decision:
            data["lastDecision"] = instance.last_decision
        return data


class SubmissionCreateSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=500)
    abstract = serializers.CharField(allow_blank=True, required=False, default="")
    contentType = serializers.ChoiceField(choices=[c for c, _ in CONTENT_TYPES])
    targetJournalId = serializers.CharField(required=False, allow_blank=True, default="")
    authorNames = serializers.CharField(max_length=500, allow_blank=True, required=False, default="")

    def validate(self, attrs):
        if attrs["contentType"] == "article" and not attrs.get("targetJournalId"):
            raise serializers.ValidationError({"targetJournalId": "Select the journal you are submitting to."})
        return attrs


class DecisionSerializer(serializers.Serializer):
    submissionId = serializers.CharField()
    decision = serializers.ChoiceField(choices=["desk_reject", "revise", "accept", "reject", "withdraw", "publish"])
    comments = serializers.CharField(allow_blank=True, required=False, default="")


class ReviewAssignmentSerializer(serializers.ModelSerializer):
    submissionId = serializers.CharField(source="submission_id")
    submissionTitle = serializers.CharField(source="submission.title")
    journal = serializers.CharField(source="submission.venue")
    dueDate = serializers.DateField(source="due_date")

    class Meta:
        model = ReviewAssignment
        fields = ["id", "submissionId", "submissionTitle", "journal", "dueDate", "status"]


class ReviewAssignmentCreateSerializer(serializers.Serializer):
    submissionId = serializers.CharField()
    reviewerEmail = serializers.EmailField()
    dueDate = serializers.DateField(required=False)


class ReviewStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=["accepted", "declined", "submitted"])
