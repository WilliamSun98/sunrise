from django.conf.urls import include, url
from django.contrib import admin
from . import views
from rest_framework import routers



router = routers.SimpleRouter()
router.register(r'login', views.AuthViewSet)
router.register(r'get-token', views.GetTokenViewSet, basename='get-token')
router.register(r'profile', views.ProfileViewSet)
router.register(r'getRole', views.GetRoleViewSet)

urlpatterns = [
	# url(r'^get-token/$', views.GetTokenView.as_view()),)
    url(r'^register/$', views.CreateUserAPIView.as_view()),
]
urlpatterns += router.urls
