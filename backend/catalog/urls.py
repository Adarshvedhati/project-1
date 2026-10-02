from django.urls import path

from . import views

urlpatterns = [
    path("search", views.SearchView.as_view()),
    path("journals", views.JournalList.as_view()),
    path("journals/<str:pk>", views.JournalDetail.as_view()),
    path("articles", views.ArticleList.as_view()),
    path("articles/<str:pk>", views.ArticleDetail.as_view()),
    path("articles/<str:pk>/related", views.ArticleRelated.as_view()),
    path("books", views.BookList.as_view()),
    path("books/<str:pk>", views.BookDetail.as_view()),
    path("case-studies", views.CaseStudyList.as_view()),
    path("case-studies/<str:pk>", views.CaseStudyDetail.as_view()),
]
