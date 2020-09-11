from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import users.models as userModels
import users.serializers as userSerializer
from rest_framework import viewsets, status
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework import authentication, permissions
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User as AuthUser
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from django.contrib.auth.hashers import make_password, check_password

# Create your views here.

# this is a helper method
# from django.forms.models import model_to_dict
# model_to_dict(obj)

class AuthViewSet(viewsets.ModelViewSet):
	queryset = userModels.User.objects.all()
	serializer_class = userSerializer.UserSerializer
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (IsAuthenticated,)

	def list(self, request):
		data = {'id': 1, 'username': 1, 'firstName': 1, 'lastName': 1, 'token': 'fake-jwt-token'};
		return HttpResponse(json.dumps(data), content_type="application/json", status=200)

	def create(self, request):
		if ('username' in request.data and 'password' in request.data):
			user = userModels.User.objects.filter(username=request.data['username'])
			if (len(user) == 1):
				user = user[0]
				if (check_password(request.data['password'], user.password)):
					data = {
						'id': user.id, 
						'username': user.username, 
						'firstName': user.firstName, 
						'lastName': user.lastName, 
						'token': 'fake-jwt-token',
						'role': user.role,
					}
					return HttpResponse(json.dumps(data), content_type="application/json", status=200)
				else:
					return HttpResponse(json.dumps('invalid password'), status=409)
			else:
				return HttpResponse(json.dumps('invalid username'), status=409)
		else:
			return HttpResponse(json.dumps('give me your password and username'), status=400)


# class GetTokenView(APIView):
# 	permissions_class = (AllowAny,)

# 	def get(self, request):
# 		return HttpResponse(json.dumps('1'), content_type="application/json", status=200)

# 	def post(self, request):
# 		username = request.data['username']
# 		user = userModels.User.objects.filter(username=username)[0]
# 		token = Token.objects.filter(user=user)[0]
# 		data = {'token': token.key}
# 		return HttpResponse(json.dumps(data), content_type="application/json", status=200)

class GetTokenViewSet(viewsets.ModelViewSet):
	queryset = Token.objects.all()
	# authentication_classes = (BasicAuthentication)
	permissions_class = (AllowAny,)

	def list(self, request):
		username = request.GET.get('username')
		if (username == None):
			return HttpResponse(json.dumps('give me your user name'), status=400)
		else:
			user = userModels.User.objects.filter(username=username)
			if (len(user) != 1):
				return HttpResponse(json.dumps('user not registered'), status=409)
			else:
				user = user[0]
				token = Token.objects.filter(user=user)[0]
				data = {'token': token.key}
				return HttpResponse(json.dumps(data), content_type="application/json", status=200)

	def create(self, request):
		username = request.POST.get('username')
		if (username == None):
			return HttpResponse(json.dumps('give me your user name'), status=400)
		else:
			user = userModels.User.objects.filter(username=username)
			if (len(user) != 1):
				return HttpResponse(json.dumps('user not registerd'), status=409)
			else:
				user = user[0]
				token = Token.objects.filter(user=user)[0]
				data = {'token': token.key}
				return HttpResponse(json.dumps(data), content_type="application/json", status=200)


class CreateUserAPIView(APIView):
    # Allow any user (authenticated or not) to access this url 
    permission_classes = (AllowAny,)
    queryset = userModels.User.objects.all()
    serializer_class = userSerializer.UserRegisterSerializer
 
    def post(self, request):
        user = request.data
        username = user['username']
        if (username != None):
        	serializer = userSerializer.UserRegisterSerializer(data=user)
	        serializer.is_valid(raise_exception=True)
	        serializer.save()
	        user = userModels.User.objects.filter(username=username)[0]
	        user.password = make_password(user.password)
	        user.save()
	        return HttpResponse(json.dumps("success"), status=status.HTTP_201_CREATED)
        	# else:
        	# 	return HttpResponse(json.dumps('user does not exist or duplicate users'), status=409)
        else:
        	return HttpResponse(json.dumps(None), status=400)
	# @classmethod
	# def get_extra_actions(cls):
	# 	return []

class ProfileViewSet(viewsets.ModelViewSet):
	queryset = userModels.User.objects.all()
	serializer_class = userSerializer.UserSerializer
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (IsAuthenticated,)

	def list(self, request):
		username = request.GET.get('username', None)
		if (username != None):
			user = userModels.User.objects.filter(username=username)
			if (len(user) != 1):
				return HttpResponse(json.dumps(None), status=409)
			else:
				user = user[0]
				serializer = userSerializer.UserSerializer(user)
				return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)

	def create(self, request):
		username = request.data['username']
		user = userModels.User.objects.filter(username=username)
		if (len(user) != 1):
			return HttpResponse(json.dumps(None), status=409)
		else:
			user = user[0]
			user.email = request.data['email']
			user.phoneNumber = request.data['phoneNumber']
			user.firstName = request.data['firstName']
			user.lastName = request.data['lastName']
			user.address = request.data['address']
			user.selfIntro = request.data['user_description']
			user.save()
			return HttpResponse(json.dumps('success'), status=status.HTTP_201_CREATED)

class GetRoleViewSet(viewsets.ModelViewSet):
	queryset = userModels.User.objects.all()
	serializer_class = userSerializer.UserSerializer
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (IsAuthenticated,)

	def list(self, request):
		pass

	def create(self, request):
		if ('username' in request.data):
			username = request.data['username']
			user = userModels.User.objects.filter(username=username)
			if (len(user) != 1):
				return HttpResponse(json.dumps('user not exist or duplicated'), status=409)
			else:
				user = user[0]
				return HttpResponse(json.dumps(user.role), status=200)
		else:
			return HttpResponse(json.dumps('not user name exist'), status=400)








