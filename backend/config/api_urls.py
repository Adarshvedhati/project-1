from django.urls import include, path

urlpatterns = [
    path("", include("accounts.urls")),
    path("", include("catalog.urls")),
    path("", include("workflow.urls")),
    path("", include("engagement.urls")),
]
