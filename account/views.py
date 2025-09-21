from django.shortcuts import get_object_or_404
from rest_framework import permissions, generics, status
from rest_framework.exceptions import ValidationError
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken

from .serializers import UserSerializer, UserTokenObtainPairSerializer, AgentUserSerializer
from .models import MyUser, Agent


class ClientUserListApiView(generics.ListAPIView):
    serializer_class = UserSerializer

    def get_queryset(self):
        client_queryset = MyUser.objects.filter(is_agent=False)
        return client_queryset
    

class AgentUserListApiView(generics.ListAPIView):
    serializer_class = AgentUserSerializer
    queryset = Agent.objects.all()
    

class ClientUserDetailRetrieveApiView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer
    lookup_field = 'pk'

    def get_queryset(self):
        client_queryset = MyUser.objects.filter(is_agent=False)
        return client_queryset


class AgentUserDetailRetrieveApiView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AgentUserSerializer
    lookup_field = 'pk'

    def get_queryset(self):
        user = get_object_or_404(MyUser, pk=self.kwargs.get('pk'), is_agent=True)
        return Agent.objects.filter(user=user)
    
    def get_object(self):
        queryset = self.get_queryset()
        obj = get_object_or_404(queryset)
        return obj


class ClientUserDetailUpdateApiView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer
    lookup_field = 'pk'

    def get_queryset(self):
        client_queryset = MyUser.objects.filter(is_agent=False)
        return client_queryset

    def perform_update(self, serializer):
        if 'password' in serializer.validated_data:
            password = serializer.validated_data.pop('password')
            serializer.instance.set_password(password)
        serializer.save()


class AgentUserDetailUpdateApiView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AgentUserSerializer
    

    def get_queryset(self):
        user = get_object_or_404(MyUser, pk=self.kwargs.get('pk'))
        return Agent.objects.filter(user=user)
    
    def get_object(self):
        queryset = self.get_queryset()
        obj = get_object_or_404(queryset)
        return obj

    def perform_update(self, serializer):
        if 'password' in serializer.validated_data:
            password = serializer.validated_data.pop('password')
            serializer.instance.set_password(password)
        serializer.save()     


class ClientUserCreateApiView(generics.CreateAPIView):
    queryset = MyUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AgentUserCreateApiView(generics.CreateAPIView):
    queryset = Agent.objects.all()
    serializer_class = AgentUserSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser]
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            if serializer.is_valid(raise_exception=True):
                self.perform_create(serializer)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)


class UserLogoutApiView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except (TokenError, InvalidToken):
            return Response(status=status.HTTP_400_BAD_REQUEST)
    

class UserTokenObtainPairView(TokenObtainPairView):
    serializer_class = UserTokenObtainPairSerializer
    