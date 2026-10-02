from django.contrib import admin

from .models import EditorialDecisionRecord, ReviewAssignment, Submission


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ["id", "title", "author", "status", "content_type", "updated_at"]
    list_filter = ["status", "content_type"]
    search_fields = ["id", "title", "author__email"]


admin.site.register(ReviewAssignment)
admin.site.register(EditorialDecisionRecord)
