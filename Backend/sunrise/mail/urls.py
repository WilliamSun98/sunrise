from django.conf.urls import include, url
from django.contrib import admin
from . import views
from rest_framework import routers



router = routers.SimpleRouter()
router.register(r'send-email', views.SendMailViewSet, basename='send-email')
router.register(r'testurl', views.TestViewSet, basename='test')

urlpatterns = [
]
urlpatterns += router.urls