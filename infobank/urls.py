from django.urls import path
from .views import *

app_name = 'infobank'

urlpatterns = [
    # path('', home, name="home"), 
    #  path('category/<slug:slug>/',category_details, name="category_details"),
    # path('folder/<int:id>/', folder_details, name="folder_details"),

    path('category/<slug:slug>/', CategoryDetails.as_view(),
         name="category_details"),
    path('folder/<int:id>/', FolderDetails.as_view(), name="folder_details"),
    path('manage-folder/', ManageFolderView.as_view(), name="manage_folder"),
    path('manage-file/', ManageFileView.as_view(), name="manage_file"),


    path('share-content/', ShareContent.as_view(), name="share_content"),
    

    # path('users/', ManageUser.as_view(), name="manage_users"),
    # path('user/<int:id>', ManageUser.as_view(), name="manage_single_users"),

]
