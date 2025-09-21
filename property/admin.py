from django.contrib import admin

from .models import Property, PropertyImage, PropertyWishList


class PropertyImageInline(admin.StackedInline):
    model = PropertyImage
    extra = 1


class PropertyAdmin(admin.ModelAdmin):
    inlines = [PropertyImageInline]


admin.site.register(Property, PropertyAdmin)
admin.site.register(PropertyWishList)

