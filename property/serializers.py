from rest_framework import serializers

from account.serializers import AgentUserSerializer

from .models import Property, PropertyImage, PropertyWishList


class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = '__all__'


class PropertySerializer(serializers.ModelSerializer):
    agent = AgentUserSerializer(read_only=True)
    images = PropertyImageSerializer(many=True, read_only=True)
    contact_email = serializers.EmailField(source='owner.email', read_only=True)

    class Meta:
        model = Property
        fields = [
            "id",
            "images",
            "description",
            "added_at",
            "updated_at",
            "is_active",
            "address_line1",
            "address_line2",
            "town",
            "region",
            "postcode",
            "property_type",
            "bedroom",
            "toilet",
            "price_type",
            "price",
            "agent",
            "contact_email",
            "location_lat",
            "location_lon",
            "get_formatted_address"
        ]


class PropertyWishListSerializer(serializers.ModelSerializer):
    property_detail = PropertySerializer(source='property', read_only=True)

    class Meta:
        model = PropertyWishList
        fields = ('id', 'user', 'property', 'added_at', 'property_detail')
        read_only_fields = ['user', 'property']