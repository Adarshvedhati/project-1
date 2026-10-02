from django.db.models import Sum
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from catalog.models import Article, Book, CaseStudy, Journal
from core.permissions import has_any_role, user_roles

from .models import Alert, Bookmark, Subscription, UsageStat

CONTENT_MODELS = {"article": Article, "journal": Journal, "book": Book, "case_study": CaseStudy}


def _bookmark(b: Bookmark) -> dict:
    return {"id": str(b.pk), "contentId": b.content_id, "contentType": b.content_type, "title": b.title,
            "savedAt": b.saved_at.date().isoformat()}


class BookmarkListCreate(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response([_bookmark(b) for b in Bookmark.objects.filter(user=request.user)])

    def post(self, request):
        content_id = str(request.data.get("contentId", ""))
        content_type = request.data.get("contentType")
        model = CONTENT_MODELS.get(content_type)
        if model is None or not content_id:
            return Response({"detail": "contentId and a valid contentType are required."}, status=status.HTTP_400_BAD_REQUEST)
        obj = get_object_or_404(model, pk=content_id)
        bookmark, created = Bookmark.objects.get_or_create(
            user=request.user, content_type=content_type, content_id=content_id, defaults={"title": obj.title})
        return Response(_bookmark(bookmark), status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


class BookmarkDetail(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        get_object_or_404(Bookmark, pk=pk, user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


def _alert(a: Alert) -> dict:
    return {"id": str(a.pk), "message": a.message, "createdAt": a.created_at.date().isoformat(), "read": a.read}


class AlertList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response([_alert(a) for a in Alert.objects.filter(user=request.user)[:100]])


class AlertDetail(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        alert = get_object_or_404(Alert, pk=pk, user=request.user)
        alert.read = bool(request.data.get("read", True))
        alert.save(update_fields=["read"])
        return Response(_alert(alert))


def _institution_scope(user):
    """Librarians see their own institution; admins see everything."""
    if "admin" in user_roles(user):
        return None
    return user.institution_id or -1


class SubscriptionList(APIView):
    permission_classes = [has_any_role("librarian", "admin")]

    def get(self, request):
        qs = Subscription.objects.select_related("journal")
        scope = _institution_scope(request.user)
        if scope is not None:
            qs = qs.filter(institution_id=scope)
        return Response([
            {"id": f"sub-{s.journal_id}", "journalTitle": s.journal.title, "plan": s.plan,
             "renewalDate": s.renewal_date.isoformat()} for s in qs
        ])


class UsageAnalytics(APIView):
    """FR-10: monthly downloads for the caller's institution (all institutions for admins)."""

    permission_classes = [has_any_role("librarian", "admin")]

    def get(self, request):
        qs = UsageStat.objects.all()
        scope = _institution_scope(request.user)
        if scope is not None:
            qs = qs.filter(institution_id=scope)
        rows = qs.values("month").annotate(total=Sum("downloads")).order_by("month")
        return Response([{"month": r["month"].strftime("%b"), "downloads": r["total"]} for r in list(rows)[-12:]])
