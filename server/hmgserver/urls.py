"""
URL configuration for hmgserver project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from myapi import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/login/', views.login),
    path('auth/register/', views.register),
    path('user/me/', views.me),
    path('user/points/', views.points),
    path('user/points/update/', views.points_update),
    path('word/<str:difficulty>/random/', views.random_word),
    path('word/create/', views.word_create),
]
