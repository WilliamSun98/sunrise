from django.shortcuts import render
from rest_framework import viewsets, status
import schedule.models as scheduleModels
import schedule.serializers as scheduleSerializer
from users.models import User
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.http import HttpResponse
from django.http import JsonResponse
import json

# Create your views here.
class ScheduleSaveViewSet(viewsets.ModelViewSet):
	queryset = scheduleModels.Schedule.objects.all()
	serializer_class = scheduleSerializer.ScheduleSerializer
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (IsAuthenticated,)

	def create(self, request):
		schedule = dict(request.data)
		if ('username' in schedule):
			username = schedule['username'][0]
			del schedule['username']
			# schedule got here is 
			# {'event': ['test'], 'startTime': ['March 23, Monday'], 'endTime': ['March 27, Friday']}
			# get all the value out of the list
			for key in schedule:
				schedule[key] = schedule[key][0]
			# schedule got here is
			# {'event': 'test', 'startTime': 'March 23, Monday', 'endTime': 'March 27, Friday'}
			user = User.objects.filter(username=username)
			if (len(user) == 1):
				schedule['user'] = user[0].id	
				if (schedule['id'] == ''):
					serializer = scheduleSerializer.ScheduleSerializer(data=schedule)
					serializer.is_valid(raise_exception=True)
					serializer.save()
					return HttpResponse(json.dumps("success"), status=status.HTTP_201_CREATED)
				else:
					event = scheduleModels.Schedule.objects.filter(id=schedule['id'])
					if (len(event) != 1):
						return HttpResponse(json.dumps("invalid id"), status=409)
					else:
						event = event[0]
						serializer = scheduleSerializer.ScheduleSerializer(event, data=schedule)
						serializer.is_valid(raise_exception=True)
						serializer.save()
						return HttpResponse(json.dumps("success"), status=201)
			else:
				return HttpResponse(json.dumps('invalid user'), status=409)
		else:
			return HttpResponse(json.dumps('give me your username'), status=400)

class GetScheduleViewSet(viewsets.ModelViewSet):
	queryset = scheduleModels.Schedule.objects.all()
	serializer_class = scheduleSerializer.ScheduleSerializer
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (IsAuthenticated,)

	def create(self, request):
		if ('username' in request.data):
			username = request.data['username']
			user = User.objects.filter(username=username)
			if (len(user) == 1):
				userId = user[0].id
				schedules = scheduleModels.Schedule.objects.filter(user=userId)
				serializer = scheduleSerializer.ScheduleSerializer(schedules, many=True)
				return JsonResponse(serializer.data, status=201, safe=False)
			else:
				return HttpResponse(json.dumps('invalid user'), status=409)
		else:
			return HttpResponse(json.dumps('give me your username'), status=400)


class DeleteScheduleViewSet(viewsets.ModelViewSet):
	queryset = scheduleModels.Schedule.objects.all()
	serializer_class = scheduleSerializer.ScheduleSerializer
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (IsAuthenticated,)

	def create(self, request):
		if ('id' in request.data):
			id = request.data['id']
			if (id != ''):
				schedule = scheduleModels.Schedule.objects.filter(id=int(id))
				if (len(schedule) == 1):
					schedule=schedule[0]
					schedule.delete()
					return JsonResponse(json.dumps('success'), status=201, safe=False)
				else:
					return HttpResponse(json.dumps('invalid id'), status=409)
			else:
				return HttpResponse(json.dumps('success'), status=201)
		else:
			return HttpResponse(json.dumps('invalid input'), status=400)

class SaveMultipleDataViewSet(viewsets.ModelViewSet):
	queryset = scheduleModels.Schedule.objects.all()
	serializer_class = scheduleSerializer.ScheduleSerializer
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (IsAuthenticated,)

	def list(self, request):
		pass

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
									schedule = scheduleModels.Schedule(
										user=user, 
										event=data['description'], 
										startTime=data['startTime'], 
										endTime=data['endTime'])
									schedule.save()
									schedule = scheduleModels.Schedule(
										user=company, 
										event=data['description'], 
										startTime=data['startTime'], 
										endTime=data['endTime'])
									schedule.save()
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

		