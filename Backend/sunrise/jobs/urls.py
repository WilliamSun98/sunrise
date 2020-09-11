from django.conf.urls import include, url
from django.contrib import admin
from . import views
from rest_framework import routers



router = routers.SimpleRouter()
router.register(r'form', views.RegisterJobViewSet)
router.register(r'list', views.JobPageViewSet)
router.register(r'details', views.JobDetailViewSet)
router.register(r'getJobId', views.GetJobIDViewSet)
router.register(r'uploads', views.savePdfViewSet)
router.register(r'total', views.CountJobViewSet)
router.register(r'applicant', views.getAllApplicantViewSet)

urlpatterns = []
urlpatterns += router.urls