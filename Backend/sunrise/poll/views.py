from django.shortcuts import render
import poll.models as pollModels
from users.models import User
import poll.serializers as PollSerializers
from rest_framework import viewsets, status
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import authentication, permissions
from rest_framework.authtoken.models import Token
from django.http import JsonResponse, HttpResponse
import json
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

# Create your views here.
class RegisterPollViewSet(viewsets.ModelViewSet):
    queryset = pollModels.Poll.objects.all()
    serializer_class = PollSerializers.PollSerializer
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def list(self, request):
        pass


    def create(self, request):
        if 'username' in request.data:
            clubname = request.data['username']
            user = User.objects.filter(username=clubname)
            if (len(user) != 1):
                return HttpResponse(json.dumps('Club does not exist'), content_type="application/json", status=409)
            else:
                user = user[0]
                if user.role == 'Club':
                    pollTitle = request.data['pollTitle']
                    description = request.data['description']
                    details = request.data['details']
                    startTime = request.data['startTime']
                    endTime = request.data['endTime']
                    poll = pollModels.Poll(pollTitle=pollTitle, clubname=user, description=description,
                                           details=details, startTime=startTime, endTime=endTime)
                    poll.save()
                    serializer = PollSerializers.PollSerializer(poll)
                    return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
                    # return HttpResponse(json.dumps('success'), status=200)
                else:
                    return HttpResponse(json.dumps('you are not allowed to do this'), content_type="application/json",
                                        status=400)
                return HttpResponse(json.dumps(data), content_type="application/json", status=200)
        else:
            return HttpResponse(json.dumps(None), content_type="application/json", status=400)

class PollPageViewSet(viewsets.ModelViewSet):
	queryset = pollModels.Poll.objects.all()
	serializer_class = PollSerializers.PollSerializer
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (IsAuthenticated,)

	def list(self, request):
		pass

	def create(self, request):
		if ('page' not in request.data):
			return HttpResponse(json.dumps('invalid input'), status=400)
		else:
			result = []
			i=1
			page_start = int(request.data['page'])*15-14
			page_end = int(request.data['page'])*15
			for poll in pollModels.Poll.objects.all().order_by('-id'):
				if (i>=page_start and i<=page_end):
					obj = {'pollID': poll.id, 'pollTitle': poll.pollTitle, 'description': poll.description}
					result.append(obj)
				i+=1
			if (len(result) == 0):
				return HttpResponse(json.dumps('invalid page'), status=400)
			else:
				return JsonResponse(result, status=200, safe=False)

class PollDetailViewSet(viewsets.ModelViewSet):
	queryset = pollModels.Poll.objects.all()
	serializer_class = PollSerializers.PollSerializer
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (IsAuthenticated,)

	def list(self, request):
		pass

	def create(self, request):
		if ('pollId' not in request.data):
			return HttpResponse(json.dumps('invalid input'), status=400)
		else:
			pollid = request.data['pollId']
			poll=pollModels.Poll.objects.filter(id=pollid)
			if (len(poll) == 0):
				return HttpResponse(json.dumps('invalid id'), status=400)
			else:
				poll = poll[0]
				serializer = PollSerializers.PollSerializer(poll)
				result = {}
				for key in serializer.data:
					if (key != 'clubname'):
						result[key] = serializer.data[key]
					else:
						result[key] = poll.clubname.username
				return JsonResponse(result, status=200)



