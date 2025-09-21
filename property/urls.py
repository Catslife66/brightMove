from django.urls import path

from . import views

# api/property/
urlpatterns = [
    path('', views.PropertyListApiView.as_view()),
    # user property list
    path('user/', views.PropertyUserListApiView.as_view()),
    # property cru
    path('create/', views.PropertyCreateApiView.as_view()),
    path('<int:pk>/', views.PropertyDetailRetrieveApiView.as_view()),
    path('<int:pk>/update/', views.PropertyDetailUpdateApiView.as_view()),
    # property images crud
    path('<int:property_id>/add-images/', views.PropertyImageCreateApiView.as_view()),
    path('<int:property_id>/images/', views.PropertyImageListApiView.as_view()),
    path('images/<int:id>/update/', views.PropertyImageUpdateApiView.as_view()),
    path('images/<int:id>/delete/', views.PropertyImageDestroyApiView.as_view()),
    # property search view
    path('search/', views.PropertySearchListView.as_view()),
    # user wishlist
    path('wishlist/', views.UserPropertyWishListApiView.as_view()),
    path('wishlist/status/<int:property_id>/', views.UserPropertyWishListStatusApiView.as_view()),
    path('wishlist/add/<int:property_id>/', views.UserPropertyWishListCreateApiView.as_view()),
    path('wishlist/delete/<int:property_id>/', views.UserPropertyWishListDestroyApiView.as_view()),
]