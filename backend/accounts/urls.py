from django.urls import path

from . import views

urlpatterns = [
    path("auth/register", views.RegisterView.as_view()),
    path("auth/login", views.LoginView.as_view()),
    path("auth/logout", views.LogoutView.as_view()),
    path("auth/me", views.MeView.as_view()),
    path("admin/users", views.AdminUserListView.as_view()),
    path("admin/users/<uuid:pk>", views.AdminUserDetailView.as_view()),
    path("admin/audit-logs", views.AuditLogListView.as_view()),
]
