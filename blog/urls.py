from django.urls import path

from . import views

urlpatterns = [
    path('', views.BlogListApiView.as_view()),
    path('<int:pk>/', views.BlogRetrieveUpdateDestroyAPIView.as_view()),
]