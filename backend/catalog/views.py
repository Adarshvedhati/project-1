from django.db.models import Q
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Article, Book, CaseStudy, Journal
from .serializers import (
    ArticleSerializer,
    BookSerializer,
    CaseStudySerializer,
    JournalSerializer,
    search_item,
)


class PublicMixin:
    permission_classes = [AllowAny]
    authentication_classes: list = []


class JournalList(PublicMixin, generics.ListAPIView):
    serializer_class = JournalSerializer

    def get_queryset(self):
        qs = Journal.objects.all()
        subject = self.request.query_params.get("subject")
        return qs.filter(subject__iexact=subject) if subject else qs


class JournalDetail(PublicMixin, generics.RetrieveAPIView):
    serializer_class = JournalSerializer
    queryset = Journal.objects.all()


class ArticleList(PublicMixin, generics.ListAPIView):
    serializer_class = ArticleSerializer

    def get_queryset(self):
        qs = Article.objects.select_related("journal")
        journal_id = self.request.query_params.get("journalId")
        return qs.filter(journal_id=journal_id) if journal_id else qs


class ArticleDetail(PublicMixin, generics.RetrieveAPIView):
    serializer_class = ArticleSerializer
    queryset = Article.objects.select_related("journal")


class ArticleRelated(PublicMixin, generics.ListAPIView):
    """Same journal or subject first, newest first."""

    serializer_class = ArticleSerializer

    def get_queryset(self):
        article = generics.get_object_or_404(Article, pk=self.kwargs["pk"])
        limit = min(int(self.request.query_params.get("limit", 3) or 3), 10)
        related = (
            Article.objects.select_related("journal")
            .exclude(pk=article.pk)
            .filter(Q(journal_id=article.journal_id) | Q(subject=article.subject))
        )[:limit]
        related = list(related)
        if len(related) < limit:  # top up so the sidebar is never empty
            have = {a.pk for a in related} | {article.pk}
            related += list(Article.objects.select_related("journal").exclude(pk__in=have)[: limit - len(related)])
        return related


class BookList(PublicMixin, generics.ListAPIView):
    serializer_class = BookSerializer
    queryset = Book.objects.prefetch_related("chapters")


class BookDetail(PublicMixin, generics.RetrieveAPIView):
    serializer_class = BookSerializer
    queryset = Book.objects.prefetch_related("chapters")


class CaseStudyList(PublicMixin, generics.ListAPIView):
    serializer_class = CaseStudySerializer
    queryset = CaseStudy.objects.all()


class CaseStudyDetail(PublicMixin, generics.RetrieveAPIView):
    serializer_class = CaseStudySerializer
    queryset = CaseStudy.objects.all()


def _text_q(q: str, fields: list[str]) -> Q:
    cond = Q()
    for term in q.split():
        term_q = Q()
        for field in fields:
            term_q |= Q(**{f"{field}__icontains": term})
        cond &= term_q  # every word must match somewhere
    return cond


SEARCH_SOURCES = {
    "article": (Article, ["title", "summary", "authors", "keywords", "subject", "journal__title", "doi"]),
    "journal": (Journal, ["title", "scope", "subject", "issn"]),
    "book": (Book, ["title", "summary", "authors", "subject", "isbn"]),
    "case_study": (CaseStudy, ["title", "summary", "authors", "subject"]),
}


class SearchView(PublicMixin, APIView):
    """FR-02 global search with content-type / subject / access facets and pagination.

    GET /search?q=&page=&pageSize=&contentType=article,book&subject=&accessType=
    """

    def get(self, request):
        params = request.query_params
        q = (params.get("q") or "").strip()
        try:
            page = max(int(params.get("page", 1)), 1)
            page_size = min(max(int(params.get("pageSize", 10)), 1), 50)
        except ValueError:
            page, page_size = 1, 10

        kinds = [k for chunk in params.getlist("contentType") for k in chunk.split(",") if k in SEARCH_SOURCES]
        kinds = kinds or list(SEARCH_SOURCES)
        subjects = [s for chunk in params.getlist("subject") for s in chunk.split(",") if s]
        access = [a for chunk in params.getlist("accessType") for a in chunk.split(",") if a]

        items = []
        for kind in kinds:
            model, fields = SEARCH_SOURCES[kind]
            qs = model.objects.all()
            if kind == "article":
                qs = qs.select_related("journal")
            if q:
                qs = qs.filter(_text_q(q, fields))
            if subjects:
                qs = qs.filter(subject__in=subjects)
            if access:
                qs = qs.filter(access_type__in=access)
            items.extend(search_item(kind, obj) for obj in qs)

        lowered = q.lower()
        # title matches first, then newest.
        items.sort(key=lambda i: i["publicationDate"], reverse=True)
        if lowered:
            items.sort(key=lambda i: lowered not in i["title"].lower())

        start = (page - 1) * page_size
        return Response({"items": items[start:start + page_size], "total": len(items), "page": page, "pageSize": page_size})
