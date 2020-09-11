from __future__ import unicode_literals
from django.db import models
from django.utils import timezone
from django.db import transaction
from django.contrib.auth.models import (
    AbstractBaseUser, PermissionsMixin, BaseUserManager
)

class UserManager(BaseUserManager):
 
    def _create_user(self, email, password, **extra_fields):
        """
        Creates and saves a User with the given email,and password.
        """
        if not email:
            raise ValueError('The given email must be set')
        try:
            with transaction.atomic():
                user = self.model(email=email, **extra_fields)
                user.set_password(password)
                user.save(using=self._db)
                return user
        except:
            raise
 
    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)
 
    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
 
        return self._create_user(email, password=password, **extra_fields)

# Create your models here.
class User(AbstractBaseUser, PermissionsMixin):
	"""docstring for Question"""
	username = models.CharField(max_length=200, unique=True)
	password = models.CharField(max_length=200)
	role = models.CharField(max_length=200)
	token = models.CharField(max_length=200)
	firstName = models.CharField(max_length=200)
	lastName = models.CharField(max_length=200)
	selfIntro = models.CharField(max_length=500)
	email = models.CharField(max_length=200)
	phoneNumber = models.CharField(max_length=200)
	address = models.CharField(max_length=200)
	is_active = models.BooleanField(default=True)
	is_staff = models.BooleanField(default=False)
	date_joined = models.DateTimeField(default=timezone.now)
	objects = UserManager()

	USERNAME_FIELD = 'username'
	REQUIRED_FIELDS = ['email']

	def save(self, *args, **kwargs):
		super(User, self).save(*args, **kwargs)
		return self


