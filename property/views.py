from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from account.models import Agent
from .models import Property, PropertyImage, PropertyWishList
from .permissions import PropertyEditorPermissions, PropertyImageEditorPermissions
from .serializers import PropertySerializer, PropertyImageSerializer, PropertyWishListSerializer


class PropertyListApiView(generics.ListAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [permissions.AllowAny]


class PropertyUserListApiView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PropertySerializer

    def get_queryset(self):
        agent = Agent.objects.get(user=self.request.user)
        return Property.objects.filter(agent=agent)
        

class PropertyCreateApiView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated, PropertyEditorPermissions] 
    queryset = Property.objects.all()
    serializer_class = PropertySerializer


class PropertyDetailRetrieveApiView(generics.RetrieveAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [permissions.AllowAny]


class PropertyDetailUpdateApiView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated, PropertyEditorPermissions] 
    queryset = Property.objects.all()
    serializer_class = PropertySerializer


class PropertyImageListApiView(generics.ListAPIView):
    serializer_class = PropertyImageSerializer

    def get_queryset(self):
        property_id = self.kwargs.get('property_id')
        return PropertyImage.objects.filter(property=property_id)


class PropertyImageCreateApiView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated, PropertyImageEditorPermissions] 
    parser_classes = [MultiPartParser, FormParser]
    queryset = PropertyImage.objects.all()
    serializer_class = PropertyImageSerializer

    def perform_create(self, serializer):
        property_id = self.kwargs.get('property_id')
        property = get_object_or_404(Property, id=property_id)
        serializer.save(property=property)


class PropertyImageUpdateApiView(generics.UpdateAPIView):
    queryset = PropertyImage.objects.all()
    serializer_class = PropertyImageSerializer
    permission_classes = [permissions.IsAuthenticated, PropertyImageEditorPermissions] 
    parser_classes = [MultiPartParser, FormParser]
    lookup_field = 'id'


class PropertyImageDestroyApiView(generics.DestroyAPIView):
    queryset = PropertyImage.objects.all()
    serializer_class = PropertyImageSerializer
    permission_classes = [permissions.IsAuthenticated, PropertyImageEditorPermissions]
    parser_classes = [MultiPartParser, FormParser]
    lookup_field = 'id'
        

class UserPropertyWishListApiView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = PropertyWishList.objects.all()
    serializer_class = PropertyWishListSerializer

    def get(self, request):
        user = request.user
        user_wishlist = PropertyWishList.objects.filter(user=user)
        serializer = PropertyWishListSerializer(user_wishlist, many=True)
        return Response(serializer.data)


class UserPropertyWishListCreateApiView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = PropertyWishList.objects.all()
    serializer_class = PropertyWishListSerializer

    def perform_create(self, serializer):
        property_id = self.kwargs.get('property_id')
        property = get_object_or_404(Property, id=property_id)
        serializer.save(user=self.request.user,  property=property)


class UserPropertyWishListStatusApiView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, property_id):
        is_saved = PropertyWishList.objects.filter(user=request.user, property__id=property_id).exists()
        return JsonResponse({'isSaved': is_saved})
 

class UserPropertyWishListDestroyApiView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = PropertyWishList.objects.all()
    serializer_class = PropertyWishListSerializer

    def delete(self, request, *args, **kwargs):
        property_id = self.kwargs.get('property_id')
        wishlist = PropertyWishList.objects.filter(user=request.user, property_id=property_id)
        if not wishlist.exists():
            return Response(status=status.HTTP_404_NOT_FOUND)
        wishlist.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

'''
Property Search Views
'''
class PropertySearchListView(generics.ListAPIView):
    serializer_class = PropertySerializer
    queryset = Property.objects.all()

    def get_queryset(self):
        qs = super().get_queryset()
        q = self.request.GET.get('q')
        if q is None:
            result = qs
        else:
            result = Property.by_area.search(q).filter(is_active=True)
        return result
