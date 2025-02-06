from django.urls import path

from . import views


urlpatterns = [
    path('', views.quiz_list),
    path('<int:pk>/', views.quiz_detail),
    path('create/', views.quiz_create),
    path('<int:pk>/questions/create/', views.question_create)
]