from django.urls import path

from . import views


urlpatterns = [
    path('', views.quiz_list),
    path('<int:pk>/', views.quiz_detail),
    path('create/', views.quiz_create),
    path('<int:pk>/questions/create/', views.question_create),
    path('<int:quiz_id>/process/', views.process_quiz),
    path('<int:quiz_id>/create-user-quiz/', views.create_user_quiz),
    path('user/<user_id>/', views.user_quiz_list)
]