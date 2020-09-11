from django.conf.urls import include, url
from django.contrib import admin
from . import views
from rest_framework import routers



router = routers.SimpleRouter()
router.register(r'upload', views.uploadImageViewSet)
router.register(r'getIcon', views.getImageViewSet)

urlpatterns = []
urlpatterns += router.urls