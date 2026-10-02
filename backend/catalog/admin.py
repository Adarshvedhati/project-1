from django.contrib import admin

from .models import Article, Book, CaseStudy, Chapter, Journal


@admin.register(Journal)
class JournalAdmin(admin.ModelAdmin):
    list_display = ["title", "issn", "subject", "access_type"]
    search_fields = ["title", "issn"]


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ["title", "journal", "publication_date", "access_type"]
    list_filter = ["access_type", "journal"]
    search_fields = ["title", "doi"]


class ChapterInline(admin.TabularInline):
    model = Chapter
    extra = 0


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ["title", "isbn", "publication_date", "access_type"]
    search_fields = ["title", "isbn"]
    inlines = [ChapterInline]


@admin.register(CaseStudy)
class CaseStudyAdmin(admin.ModelAdmin):
    list_display = ["title", "subject", "publication_date", "access_type"]
    search_fields = ["title"]
