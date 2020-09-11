from rest_framework import serializers
from . import models
from django.contrib.auth.models import User as AuthUser


class UserSerializer(serializers.ModelSerializer):

	date_joined = serializers.ReadOnlyField()

	class Meta(object):
		model = models.User
		fields = ('id', 'email', 'username', 'phoneNumber', 'date_joined',
			'firstName', 'lastName', 'address', 'selfIntro'
			)

class UserRegisterSerializer(serializers.ModelSerializer):

	class Meta(object):
		model = models.User
		fields = ('username', 'firstName', 'lastName', 'password', 'role', 'email')
		extra_kwargs = {'password': {'write_only': True}}


class AuthUserSerializer(serializers.ModelSerializer):

	class Meta(object):
		model = AuthUser
		fields = ('id', 'username', 'firstName', 'lastName', 'password', 'role')
		extra_kwargs = {'password': {'write_only': True}}