from django.conf.urls import include, url
from django.contrib import admin
from . import views
from rest_framework import routers



router = routers.SimpleRouter()
router.register(r'save', views.ScheduleSaveViewSet)
router.register(r'get', views.GetScheduleViewSet)
router.register(r'delete', views.DeleteScheduleViewSet)
router.register(r'save-multiple', views.SaveMultipleDataViewSet)

urlpatterns = []
urlpatterns += router.urls