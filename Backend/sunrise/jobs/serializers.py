from rest_framework import serializers
from . import models

class JobSerializer(serializers.ModelSerializer):

	class Meta(object):
		model = models.Job
		fields = ('id', 'jobTitle', 'company', 'description', 'openFor',
			'details', 'startTime', 'endTime')

class ResumeSerializer(serializers.ModelSerializer):

	class Meta(object):
		model = models.Resume
		fields = ('id', 'user', 'job', 'pdf')