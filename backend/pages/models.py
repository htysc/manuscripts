from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Manuscript(models.Model):
    title = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='manuscripts')

class Page(models.Model):
    number = models.PositiveIntegerField()
    text1 = models.TextField()
    text2 = models.TextField()
    image = models.ImageField(upload_to='pages/', blank=True)
    manuscript = models.ForeignKey(Manuscript, on_delete=models.CASCADE, related_name='pages')
