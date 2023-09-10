from django.urls import path
from knox import views as knox_views
from django.conf.urls import url, include
from .views import *

app_name = 'auth'

urlpatterns = [
    # Auth API
    path('login/', LoginAPI.as_view(), name="login"),
    path('password/', PasswordAPI.as_view()),
    path('change-password/', ChangePasswordAPI.as_view()),
    path('user/', UserAPI.as_view()),
    path('manage-user/', ManageUserAPI.as_view()),
    path('manage-user/<int:id>', ManageUserAPI.as_view()),
    path('logout/', knox_views.LogoutView.as_view(), name='knox_logout'),
    path('search/', SearchAPI.as_view()),
    # groups
    path('groups/', GroupsAPI.as_view()),
    # Designations
    path('designations/', DesignationAPI.as_view()),
    
    ## user creation 
    path('upload/users/', CreateUserAllAPI.as_view()),
]
