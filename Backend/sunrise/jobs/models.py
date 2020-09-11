from django.db import models

# Create your models here.
class Job(models.Model):

    jobTitle = models.CharField(max_length=200)
    company = models.ForeignKey('users.User', on_delete=models.CASCADE)
    description = models.CharField(max_length=200)
    openFor = models.CharField(max_length=200)
    details = models.CharField(max_length=200)
    startTime = models.CharField(max_length=200)
    endTime = models.CharField(max_length=200)

def get_upload_file_name(instance, file):
	return 'pdf/%s/%s/%s' % (str(instance.job.id), str(instance.user.username), file)

class Resume(models.Model):
	job = models.ForeignKey('jobs.Job', on_delete=models.CASCADE)
	user = models.ForeignKey('users.User', on_delete=models.CASCADE)
	pdf = models.FileField(upload_to=get_upload_file_name)