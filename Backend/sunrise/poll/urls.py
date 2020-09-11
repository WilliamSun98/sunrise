from django.conf.urls import include, url
from django.contrib import admin
from . import views
from rest_framework import routers



router = routers.SimpleRouter()
router.register(r'form', views.RegisterPollViewSet)
router.register(r'list', views.PollPageViewSet)
router.register(r'details', views.PollDetailViewSet)

urlpatterns = []
urlpatterns += router.urls