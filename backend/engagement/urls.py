from django.urls import path

from . import views

urlpatterns = [
    path("bookmarks", views.BookmarkListCreate.as_view()),
    path("bookmarks/<int:pk>", views.BookmarkDetail.as_view()),
    path("alerts", views.AlertList.as_view()),
    path("alerts/<int:pk>", views.AlertDetail.as_view()),
    path("subscriptions", views.SubscriptionList.as_view()),
    path("admin/analytics", views.UsageAnalytics.as_view()),
]
