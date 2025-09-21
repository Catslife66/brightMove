from django.db import models


class Blog(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.CharField(max_length=50, null=True, blank=True)
    feature_img = models.ImageField(upload_to='blog', null=True, blank=True)
    created_at = models.DateField(auto_now_add=True)
