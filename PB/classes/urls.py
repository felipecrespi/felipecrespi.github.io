from django.urls import path

from classes.views import EnrollClassView, DropClassView, EnrollAllClassesView, DropAllClassesView, ListClassHistoryView

app_name = 'classes'

urlpatterns = [
    path('<int:class_id>/enroll/', EnrollClassView.as_view()),
    path('<int:class_id>/enroll/all/', EnrollAllClassesView.as_view()),
    path('<int:class_id>/dropout/', DropClassView.as_view()),
    path('<int:class_id>/dropout/all/', DropAllClassesView.as_view()),
    path('history/', ListClassHistoryView.as_view()),
]