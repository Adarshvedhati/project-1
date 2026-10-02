from django.urls import path

from . import views

urlpatterns = [
    path("submissions", views.SubmissionListCreate.as_view()),
    path("submissions/<str:pk>", views.SubmissionDetail.as_view()),
    path("editorial-decisions", views.EditorialDecisionCreate.as_view()),
    path("review-assignments", views.ReviewAssignmentListCreate.as_view()),
    path("review-assignments/<str:pk>", views.ReviewAssignmentDetail.as_view()),
]
