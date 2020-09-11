from django.shortcuts import render
from django.core.mail import send_mail
from django.conf import settings
from users.models import User
from django.http import HttpResponse
from django.http import JsonResponse
import json
from rest_framework import viewsets, status
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

# Create your views here.
class SendMailViewSet(viewsets.ModelViewSet):
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (IsAuthenticated,)


	def create(self, request):
		if ('companyName' in request.data):
			companyname = request.data['companyName']
			company = User.objects.filter(username=companyname)
			if (len(company) == 1):
				company = company[0]
				for key in request.data:
					if (key != 'companyName'):
						data = json.loads(request.data[key])
						if ('username' in data):
							username = data['username']
							user = User.objects.filter(username=username)
							if (len(user) == 1):
								user = user[0]
								if ('description' in data and 'startTime' in data and 'endTime' in data):
									subject = 'You got a interview from ' + companyname + ' from ' + data['startTime'] + ' to ' + data['endTime']
									message = data['description']
									to_mail_list = [settings.EMAIL_HOST_USER, user.email]
									send_mail(subject, message, settings.EMAIL_HOST_USER, to_mail_list, fail_silently=False)
									return HttpResponse(json.dumps('success send'), status=200)
								else:
									return HttpResponse(json.dumps('invalid input'), status=400)
							else:
								return HttpResponse(json.dumps('invalid username'), status=409)
						else:
							return HttpResponse(json.dumps('invalid input'), status=400)
			else:
				return HttpResponse(json.dumps('invalid companyname'), status=400)
		else:
			return HttpResponse(json.dumps('invalid input'), status=409)

		return HttpResponse(json.dumps('success'), status=200)


class TestViewSet(viewsets.ModelViewSet):
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (IsAuthenticated,)

	def create(self, request):
		return HttpResponse(json.dumps('success send'), status=200)
