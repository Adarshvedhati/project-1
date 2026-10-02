from django.contrib import admin
from django.urls import include, path, re_path

from core import views as core_views

urlpatterns = [
    # NOTE: the SPA owns the /admin route (Admin dashboard), so Django's own
    # admin lives at /django-admin/.
    path("django-admin/", admin.site.urls),
    path("healthz", core_views.health),
    path("api/v1/", include("config.api_urls")),
    # Everything else is a client-side route -> index.html.
    re_path(r"^(?!api/|django-admin/|static/).*$", core_views.spa),
]
