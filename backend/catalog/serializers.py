"""Serializers produce exactly the camelCase shapes of the frontend types
(`SearchResultItem`, `ArticleDetail`, `BookDetail`, `CaseStudyDetail`, `JournalSummary`)."""
from rest_framework import serializers

from .models import Article, Book, CaseStudy, Journal


class JournalSerializer(serializers.ModelSerializer):
    accessType = serializers.CharField(source="access_type")
    latestVolume = serializers.CharField(source="latest_volume")

    class Meta:
        model = Journal
        fields = ["id", "title", "issn", "scope", "subject", "accessType", "latestVolume"]


class _ContentBase(serializers.ModelSerializer):
    contentType = serializers.SerializerMethodField()
    accessType = serializers.CharField(source="access_type")
    publicationDate = serializers.DateField(source="publication_date")

    content_type_value = ""

    def get_contentType(self, obj):
        return self.content_type_value


class ArticleSerializer(_ContentBase):
    content_type_value = "article"
    journalId = serializers.CharField(source="journal_id")
    parentTitle = serializers.CharField(source="journal.title")
    citationCount = serializers.IntegerField(source="citation_count")
    fullTextAvailable = serializers.BooleanField(source="full_text_available")

    class Meta:
        model = Article
        fields = ["id", "contentType", "journalId", "title", "authors", "summary", "subject", "publicationDate",
                  "accessType", "parentTitle", "doi", "citationCount", "keywords", "fullTextAvailable"]


class BookSerializer(_ContentBase):
    content_type_value = "book"
    chapters = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = ["id", "contentType", "title", "authors", "summary", "subject", "publicationDate", "accessType",
                  "isbn", "chapters"]

    def get_chapters(self, obj):
        return [{"id": c.id, "title": c.title, "authors": c.authors} for c in obj.chapters.all()]


class CaseStudySerializer(_ContentBase):
    content_type_value = "case_study"
    learningObjectives = serializers.JSONField(source="learning_objectives")
    instructorResourcesAvailable = serializers.BooleanField(source="instructor_resources_available")

    class Meta:
        model = CaseStudy
        fields = ["id", "contentType", "title", "authors", "summary", "subject", "publicationDate", "accessType",
                  "learningObjectives", "instructorResourcesAvailable"]


def search_item(kind: str, obj) -> dict:
    """Flatten any content object into the shared `SearchResultItem` shape."""
    if kind == "journal":
        return {
            "id": obj.id, "contentType": "journal", "title": obj.title, "authors": [], "summary": obj.scope,
            "subject": obj.subject, "publicationDate": obj.established.isoformat(), "accessType": obj.access_type,
        }
    item = {
        "id": obj.id, "contentType": kind, "title": obj.title, "authors": obj.authors, "summary": obj.summary,
        "subject": obj.subject, "publicationDate": obj.publication_date.isoformat(), "accessType": obj.access_type,
    }
    if kind == "article":
        item.update(parentTitle=obj.journal.title, doi=obj.doi or None, citationCount=obj.citation_count)
    return item
