from django.db import models

# Create your models here.
class Poll(models.Model):

    pollTitle = models.CharField(max_length=200)
    clubname = models.ForeignKey('users.User', on_delete=models.CASCADE)
    description = models.CharField(max_length=200)
    details = models.CharField(max_length=200)
    startTime = models.CharField(max_length=200)
    endTime = models.CharField(max_length=200)