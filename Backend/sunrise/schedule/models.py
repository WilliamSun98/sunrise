from django.db import models
from users.models import User as userUser

# Create your models here.
class Schedule(models.Model):
	user = models.ForeignKey(userUser, on_delete=models.CASCADE)
	event = models.CharField(max_length=200)
	startTime = models.CharField(max_length=200)
	endTime = models.CharField(max_length=200)