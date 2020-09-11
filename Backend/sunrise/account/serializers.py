from rest_framework import serializers
from . import models

class ImageSerializer(serializers.ModelSerializer):

	class Meta(object):
		model = models.Image
		fields = ('id', 'user', 'imgfile')