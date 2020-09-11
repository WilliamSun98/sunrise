from django.db import models

def get_upload_file_name(instance, file):
    return '%s/%s' % (str(instance.user.username), file)

# Create your models here.
class Image(models.Model):
    user = models.ForeignKey('users.User', on_delete=models.CASCADE)
    imgfile =  models.ImageField(upload_to=get_upload_file_name, null=True)
