from django.db import models
from django.db.models import Q
from account.models import Agent, MyUser


class PropertyQuerySet(models.QuerySet):
    def is_active(self):
        return self.filter(is_active=True)
    
    def search(self, query):
        lookup = Q(town__icontains=query) | Q(postcode__icontains=query)
        qs = self.filter(lookup)
        return qs


class PropertyManager(models.Manager):
    def get_queryset(self, *args, **kwargs):
        return PropertyQuerySet(self.model, using=self._db)

    def search(self, query):
        return self.get_queryset().search(query=query)
    

class Property(models.Model):
    agent = models.ForeignKey(Agent, on_delete=models.CASCADE, related_name='agent_property')
    description = models.TextField()
    added_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)
    is_active = models.BooleanField(default=False)
    address_line1 = models.CharField(max_length=120)
    address_line2 = models.CharField(max_length=120, blank=True)
    town = models.CharField(max_length=50)
    region = models.CharField(max_length=50, blank=True)
    postcode = models.CharField(max_length=10)
    PROPERTY_TYPE_CHOICES = [
        ('Detached', 'Detached'),
        ('Semi-detached', 'Semi-detached'),
        ('Flat', 'Flat'),
        ('Bangalow', 'Bangalow')
    ]
    property_type = models.CharField(max_length=20, choices=PROPERTY_TYPE_CHOICES)
    bedroom = models.IntegerField()
    toilet = models.IntegerField()
    PRICE_TYPE_CHOICES = [
        ('Offers over', 'Offers over'),
        ('Fixed price', 'Fixed price')
    ]
    price_type = models.CharField(max_length=20, choices=PRICE_TYPE_CHOICES, default='Offers over')
    price = models.BigIntegerField()
    location_lat = models.CharField(max_length=100)
    location_lon = models.CharField(max_length=100)

    objects = models.Manager()
    by_area = PropertyManager()

    class Meta:
        verbose_name_plural = 'properties'

    @property
    def get_formatted_postcode(self):
        formated_postcode = self.postcode.upper().replace(" ", "")
        return formated_postcode[:3] + " " + formated_postcode[3: ]
    
    @property
    def get_formatted_address(self):
        address_1 = self.address_line1
        town = self.town
        postcode = self.get_formatted_postcode
        return f'{address_1}, {town}, {postcode}'
        

class PropertyImage(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='image')
    is_feature = models.BooleanField(default=False)
    alt_text = models.CharField(max_length=100)


class PropertyWishList(models.Model):
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='saved_property')
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='wishlist')
    added_at = models.DateField(auto_now_add=True)