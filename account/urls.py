from django.urls import path

from . import views

# /api/account/
urlpatterns = [
    # LIST
    path('', views.ClientUserListApiView.as_view()),
    path('agent/', views.AgentUserListApiView.as_view()),
    # DETAIL
    path('<int:pk>/', views.ClientUserDetailRetrieveApiView.as_view()),
    path('agent/<int:pk>/', views.AgentUserDetailRetrieveApiView.as_view()),
    # UPDATE
    path('<int:pk>/update/', views.ClientUserDetailUpdateApiView.as_view()),
    path('agent/<int:pk>/update/', views.AgentUserDetailUpdateApiView.as_view()),
    # CREATE
    path('register/', views.ClientUserCreateApiView.as_view()),
    path('agent/register/', views.AgentUserCreateApiView.as_view()),
    # LOGOUT
    path('logout/', views.UserLogoutApiView.as_view()),
]
