from rest_framework import serializers
from . import models

class ScheduleSerializer(serializers.ModelSerializer):

	class Meta(object):
		model = models.Schedule
		fields = ('user', 'event', 'startTime', 'endTime', 'id')