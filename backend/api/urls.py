from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView

from . import views


urlpatterns = [
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.register),
    path('login/', views.login),
    path('quiz/', include('quiz.urls')),
    path('categories/', include('categories.urls')),
    path('users/', views.user_list)
]