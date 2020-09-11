from django.shortcuts import render
import jobs.models as jobModels
import jobs.serializers as jobSerializers
from users.models import User
from rest_framework import viewsets, status
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import authentication, permissions
from rest_framework.authtoken.models import Token
from django.http import JsonResponse, HttpResponse
import json
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from dateutil import parser
import datetime


# Create your views here.
class RegisterJobViewSet(viewsets.ModelViewSet):
	queryset = jobModels.Job.objects.all()
	serializer_class = jobSerializers.JobSerializer
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (IsAuthenticated,)

	def list(self, request):
		pass

	def create(self, request):
		if 'username' in request.data:
			companyname = request.data['username']
			user = User.objects.filter(username=companyname)
			if (len(user) != 1):
				return HttpResponse(json.dumps('company does not install'), content_type="application/json", status=409)
			else:
				user = user[0]
				if user.role == 'Company':
					jobTitle = request.data['jobTitle']
					description = request.data['description']
					openFor = request.data['openFor']
					details = request.data['details']
					startTime = request.data['startTime']
					endTime = request.data['endTime']
					job = jobModels.Job(jobTitle=jobTitle, company=user, description=description, 
						openFor=openFor, details=details, startTime=startTime, endTime=endTime)
					job.save()
					serializer = jobSerializers.JobSerializer(job)
					return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
				else:
					return HttpResponse(json.dumps('you are not allowed to do this'), content_type="application/json", status=400)
				return HttpResponse(json.dumps(data), content_type="application/json", status=200)
		else:
			return HttpResponse(json.dumps(None), content_type="application/json", status=400)



class JobPageViewSet(viewsets.ModelViewSet):
	queryset = jobModels.Job.objects.all()
	serializer_class = jobSerializers.JobSerializer
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (IsAuthenticated,)

	def list(self, request):
		pass

	def create(self, request):
		if ('page' not in request.data and 'username' not in request.data):
			return HttpResponse(json.dumps('invalid input'), status=400)
		else:
			result = []
			i=1
			page_start = int(request.data['page'])*15-14
			page_end = int(request.data['page'])*15
			username = request.data['username']
			user = User.objects.filter(username=username)
			if (len(user) == 1):
				user = user[0]
				if (user.role == 'Student'):
					for job in jobModels.Job.objects.all().order_by('-id'):
						now = datetime.datetime.now()
						endtime = parser.parse(job.endTime)
						endtime = endtime.replace(tzinfo=None)
						if (i>=page_start and i<=page_end and now<endtime):
							obj = {'jobID': job.id, 'jobTitle': job.jobTitle, 'description': job.description}
							result.append(obj)
						i+=1
					if (len(result) == 0):
						return HttpResponse(json.dumps('invalid page'), status=400)
					else:
						return JsonResponse(result, status=200, safe=False)
				elif (user.role == 'Company'):
					for job in jobModels.Job.objects.filter(company=user.id).order_by('-id'):
						if (i>=page_start and i<=page_end):
							obj = {'jobID': job.id, 'jobTitle': job.jobTitle, 'description': job.description}
							result.append(obj)
						i+=1
					if (len(result) == 0):
						return HttpResponse(json.dumps('invalid page'), status=400)
					else:
						return JsonResponse(result, status=200, safe=False)
			else:
				return HttpResponse(json.dumps('invalid username'), status=400)


class JobDetailViewSet(viewsets.ModelViewSet):
	queryset = jobModels.Job.objects.all()
	serializer_class = jobSerializers.JobSerializer
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (IsAuthenticated,)

	def list(self, request):
		pass

	def create(self, request):
		if ('jobId' not in request.data):
			return HttpResponse(json.dumps('invalid input'), status=400)
		else:
			jobid = request.data['jobId']
			job=jobModels.Job.objects.filter(id=jobid)
			if (len(job) == 0):
				return HttpResponse(json.dumps('invalid id'), status=400)
			else:
				job = job[0]
				serializer = jobSerializers.JobSerializer(job)
				result = {}
				for key in serializer.data:
					if (key != 'company'):
						result[key] = serializer.data[key]
					else:
						result[key] = job.company.username
				return JsonResponse(result, status=200)

class GetJobIDViewSet(viewsets.ModelViewSet):
	queryset = jobModels.Job.objects.all()
	serializer_class = jobSerializers.JobSerializer
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (IsAuthenticated,)

	def list(self, request):
		pass

	def create(self, request):
		if ('jobTitle' not in request.data):
			return HttpResponse(json.dumps('invalid input'), status=400)
		else:
			jobTitle = request.data['jobTitle']
			job=jobModels.Job.objects.filter(jobTitle=jobTitle)
			if (len(job) == 0):
				return HttpResponse(json.dumps('invalid id'), status=400)
			else:
				job = job[0]
				return JsonResponse({'jobId': job.id}, status=200)

class CountJobViewSet(viewsets.ModelViewSet):
	queryset = jobModels.Job.objects.all()
	serializer_class = jobSerializers.JobSerializer
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (IsAuthenticated,)

	def list(self, request):
		pass

	def create(self, request):
		if ('username' not in request.data):
			return HttpResponse(json.dumps('invalid input'), status=400)
		else:
			username = request.data['username']

			user = User.objects.filter(username=username)
			if (len(user) != 1):
				return HttpResponse(json.dumps('invalid username'), status=400)
			else:
				user = user[0]
				role = user.role
				if (role=='Student'):
					result = []
					jobs = jobModels.Job.objects.all()
					for job in jobs:
						now = datetime.datetime.now()
						endtime = parser.parse(job.endTime)
						endtime = endtime.replace(tzinfo=None)
						if (now < endtime):
							result.append(job)
					return HttpResponse(json.dumps(len(result)), status=200)
				elif (role=='Company'):
					jobs = jobModels.Job.objects.filter(company=user.id)
					return HttpResponse(json.dumps(len(jobs)), status=200)

class savePdfViewSet(viewsets.ModelViewSet):
	queryset = jobModels.Resume.objects.all()
	serializer_class = jobSerializers.ResumeSerializer
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (IsAuthenticated,)

	def list(self, request):
		pass

	def create(self, request):
		if ('jobId' in request.data and 'file' in request.data and 'username' in request.data):
			jobId = request.data['jobId']
			file = request.data['file']
			username = request.data['username']
			user = User.objects.filter(username=username)
			if (len(user) == 1):
				user = user[0]
				job = jobModels.Job.objects.filter(id=jobId)
				if (len(job) != 1):
					return HttpResponse(json.dumps('invalid jobId'), status=400)
				else:
					job = job[0]
					pdf = jobModels.Resume(user=user, job=job, pdf=file)
					pdf.save()
					return HttpResponse(json.dumps('success'), status=201)
			else:
				return HttpResponse(json.dumps('invalid username'), status=400)
		else:
			return HttpResponse(json.dumps('invalid input'), status=400)



class getAllApplicantViewSet(viewsets.ModelViewSet):
	queryset = jobModels.Resume.objects.all()
	serializer_class = jobSerializers.ResumeSerializer
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (IsAuthenticated,)

	def list(self, request):
		pass

	def create(self, request):
		if ('jobId' in request.data):
			names = []
			jobId = request.data['jobId']
			resumes = jobModels.Resume.objects.filter(job=jobId)
			for resume in resumes:
				print(resume.user)
				names.append(resume.user.username)
			return HttpResponse(json.dumps(names), status=200)
		else:
			return HttpResponse(json.dumps('invalid input'), status=400)



		
