from rest_framework import serializers
from . import models

class PollSerializer(serializers.ModelSerializer):

	class Meta(object):
		model = models.Poll
		fields = ('id', 'pollTitle', 'description', 'details', 'startTime', 'endTime', 'clubname')