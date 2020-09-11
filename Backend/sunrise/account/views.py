from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
import json
from rest_framework import viewsets, status
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from . import models as AccountModels
from users.models import User
from . import serializers as AccountSerializers

# Create your views here.

class uploadImageViewSet(viewsets.ModelViewSet):
	queryset = AccountModels.Image.objects.all()
	serializer_class = AccountSerializers.ImageSerializer
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (IsAuthenticated,)

	def list(self, request):
		pass

	def create(self, request):
		if ('username' in request.data and 'file' in request.data):
			username = request.data['username']
			file = request.data['file']
			user = User.objects.filter(username=username)
			if (len(user) == 1):
				user = user[0]
				image = AccountModels.Image(user=user, imgfile=file)
				image.save()
				return HttpResponse(json.dumps('success'), status=200)
			else:
				return HttpResponse(json.dumps('invalid username'), status=409)
		else:
			return HttpResponse(json.dumps('invalid input'), status=400)

class getImageViewSet(viewsets.ModelViewSet):
	queryset = AccountModels.Image.objects.all()
	serializer_class = AccountSerializers.ImageSerializer
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (IsAuthenticated,)

	def list(self, request):
		pass

	def create(self, request):
		if ('username' in request.data):
			username = request.data['username']
			user = User.objects.filter(username=username)
			if (len(user) == 1):
				user = user[0]
				image = AccountModels.Image.objects.filter(user=user.id)
				if (len(image) == 0):
					return HttpResponse(json.dumps('no image yet'), status=200)
				else:
					image = image[len(image)-1]
					serializer = AccountSerializers.ImageSerializer(image)
					return JsonResponse(serializer.data, status=201)
			else:
				return HttpResponse(json.dumps('invalid username'), status=409)
		else:
			return HttpResponse(json.dumps('invalid input'), status=400)



