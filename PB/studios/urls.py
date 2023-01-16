from django.urls import path

from studios.views import StudioView, ListStudioView, ListStudioClassesView

app_name = 'studios'

urlpatterns = [
    path('<int:studio_id>/', StudioView.as_view()),
    path('<int:studio_id>/classes/', ListStudioClassesView.as_view()),
    path('all/', ListStudioView.as_view()),
]