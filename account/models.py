from django.db import models
from django.contrib.auth.models import AbstractUser, Group
from django.db.models.signals import post_save
from django.shortcuts import get_object_or_404
from django.dispatch import receiver

class MyUser(AbstractUser):
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    is_agent = models.BooleanField(default=False)


class Agent(models.Model):
    user = models.OneToOneField(MyUser, on_delete=models.CASCADE, related_name='agent_profile')
    company_name = models.CharField(max_length=100)
    company_logo = models.ImageField(upload_to='agents/logos/', null=True, blank=True)
    telephone = models.CharField(max_length=20)
    intro = models.TextField()
    address_line1 = models.CharField(max_length=120)
    address_line2 = models.CharField(max_length=120, blank=True)
    town = models.CharField(max_length=50)
    region = models.CharField(max_length=50, blank=True)
    location_lat = models.CharField(max_length=100)
    location_lon = models.CharField(max_length=100)


@receiver(post_save, sender=MyUser)
def grant_agent_permission(sender, instance, created, **kwargs):
    if created and instance.is_agent:
        agent_permission_group = get_object_or_404(Group, name="property_editor")
        instance.groups.add(agent_permission_group)
            