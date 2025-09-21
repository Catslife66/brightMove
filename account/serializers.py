from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.hashers import make_password
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from .models import MyUser, Agent


class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(validators=[UniqueValidator(queryset=MyUser.objects.all())])
    email = serializers.EmailField(validators=[UniqueValidator(queryset=MyUser.objects.all())])
    password = serializers.CharField(validators=[validate_password])
   
    class Meta:
        model = MyUser
        fields = ['id', 'username', 'email', 'phone_number', 'password', 'is_agent']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = MyUser.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            phone_number=validated_data.get('phone_number', '')
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
    

class AgentUserSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    
    class Meta:
        model = Agent
        fields = [
            'user',
            'company_name',
            'company_logo',
            'telephone',
            'intro',
            'address_line1',
            'address_line2',
            'town',
            'region',
            'location_lat',
            'location_lon',
        ]

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = UserSerializer().create(user_data)
        user.is_agent = True
        user.save()
        agent = Agent.objects.create(user=user, **validated_data)
        return agent

            
class UserTokenObtainPairSerializer(TokenObtainPairSerializer):
    # customise the JWT token serializer to add extra user information
    def validate(self, attrs):
        data = super().validate(attrs)
        data.update({
            'userid':self.user.id,
            'username': self.user.username,
            'isAgent': self.user.is_agent
        })
        return data
