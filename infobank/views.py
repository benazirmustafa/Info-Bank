from django.shortcuts import render, redirect
from rest_framework import viewsets, permissions, generics, mixins
from django.core import serializers
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions
from django.core.exceptions import PermissionDenied
from django.utils import timezone
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
# Pagination for REST FRAMEWORK TAKEN
from rest_framework.pagination import LimitOffsetPagination
from django_filters.rest_framework import DjangoFilterBackend, FilterSet
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.parsers import MultiPartParser
from django.http import HttpResponse

# FOR PUT & DELETE METHODS
from django.http import QueryDict

# Auth
from django.contrib import messages
from django.contrib.auth import logout
from django.contrib.auth import authenticate, login
from django.http import HttpResponseRedirect, JsonResponse, FileResponse
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.db import IntegrityError

# from .serializers import DepartmentSerializer
from appauth.models import User
from .models import Category, Folder, File
from .serializers import *
from django.views import View
from appauth.serializers import UserShortSerializer
from guardian.shortcuts import assign_perm,get_users_with_perms,remove_perm
from guardian.shortcuts import get_objects_for_user
# Create your views here.

def find_breadcumbs(folder):
    pwd = folder
    breadcumbs = []
    breadcumbs.insert(0, folder)
    while pwd.parent_directory != None:
        breadcumbs.insert(0, pwd.parent_directory)
        pwd = pwd.parent_directory
    return breadcumbs

class CategoryDetails(APIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get(self, request, slug):
        if slug == "shared":
            category = Category.objects.get(slug="personal")
           
            try:
                category_serializer = CategoryDetailsSerialiser(category, context={"user":request.user,"type":"shared"})
            except:
                return Response(category_serializer.error, status=status.HTTP_400_BAD_REQUEST)
        elif slug == "personal":    
            category = Category.objects.get(slug=slug)
           
            try:
                category_serializer = CategoryDetailsSerialiser(category, context={"user":request.user,"type":"personal"})
            except:
                return Response(category_serializer.error, status=status.HTTP_400_BAD_REQUEST)
        perm_change = request.user.has_perm('change_category', category)
        # perm_view = request.user.has_perm('view_category', category)

        # if perm_view:
        can_upload = False
        can_add_folder = False
        if request.user.is_staff:
            can_upload = True
            can_add_folder = True
        elif request.user in category.owners.all():
            can_upload = True

        context = {
            "category": category_serializer.data,
            'folder': None,
            'can_upload': can_upload,
            'can_add_folder': can_add_folder,

        }
        return Response(context, status=status.HTTP_200_OK)
        
class secureFile(APIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]
    def get(self, request):
        path, filename =  request.path_info.split("media/")
        document =get_object_or_404(File, file=filename) 
        perm_view = request.user.has_perm('view_file', document)
        media_path="media/"+filename
        if perm_view:
            with open(media_path, "rb") as f:
                file_data = f.read()

            # sending response 
            response = HttpResponse(file_data, content_type='application/file')
            response['Content-Disposition'] = 'inline; filename='+os.path.basename(media_path)
            return response
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
    
class FolderDetails(APIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get(self, request, id):
        folder = Folder.objects.get(id=id)
        perm_change = request.user.has_perm('change_folder', folder)
        perm_view = request.user.has_perm('view_folder', folder)
       
        if perm_view:
            try:
                folder_serializer = FolderDetailSerialiser(folder, context={"user":request.user} )
            except:
                return Response(folder_serializer.error, status=status.HTTP_400_BAD_REQUEST)
            # BREADCUMBS
            breadcumbs = find_breadcumbs(folder)
            breadcumbs_serializer = FolderSerialiser(breadcumbs, context={"user":request.user}, many=True)
            can_upload = False
            can_add_folder = False
            
            if request.user.is_staff or perm_change:
                can_upload = True
                can_add_folder = True
            elif request.user in folder.category.owners.all():
                can_upload = True
            elif request.user in folder.owners.all():
                can_upload = True
           
            context = {
                "folder": folder_serializer.data,
                'breadcumbs': breadcumbs_serializer.data,
                'can_upload': can_upload,
                'can_add_folder': can_add_folder,
            
            }
            return Response(context, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

class ShareContent(APIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]
    def get(self, request):
        id = request.GET.get("id")
        type = request.GET.get("type")
        if type == "folder":
            folder = Folder.objects.get(id= id)
            userList = get_users_with_perms(folder, attach_perms=True)
            users=[]
            for user, permissions in userList.items():
                user_details = UserShortSerializer(user).data
                if "change_folder" in permissions:
                    user_permission= "edit"
                    users.append({
                        'user':user_details,
                        'permissions':user_permission,
                        "owner":(folder.created_by == user)
                    })
                elif "view_folder" in permissions: 
                    user_permission= "view"
                    users.append({
                        'user':user_details,
                        'permissions':user_permission,
                        "owner":(folder.created_by == user)
                    })
        elif type == "file":
            file = File.objects.get(id= id)
            userList = get_users_with_perms(file, attach_perms=True)
            users=[]
            for user, permissions in userList.items():
                user_details = UserShortSerializer(user).data
                if "change_file" in permissions:
                    user_permission= "edit"
                    users.append({
                        'user':user_details,
                        'permissions':user_permission,
                        "owner":(file.created_by == user)
                    })
                elif "view_file" in permissions: 
                    user_permission= "view"
                    users.append({
                        'user':user_details,
                        'permissions':user_permission,
                         "owner":(file.created_by == user)
                    })  

        return Response(list(users), status=status.HTTP_200_OK)

    def put(self, request):
        type = request.GET.get("type")
        permission = request.data.get("permission")
        users = request.data.get("users")
        prevsusers = request.data.get("prevsusers")
         
        if  type=="folder" :
            folder = Folder.objects.get(id= request.data.get("id"))
            perm = request.user.has_perm('change_folder', folder)
            if perm:
                if "prevsusers" in request.data:
                    prev_user_permissions = get_users_with_perms(folder, attach_perms=True).keys()
                    current_user_permissions =  [ sub['prevuser'] for sub in prevsusers ] 
                    current_user_permissions = User.objects.filter(email__in=current_user_permissions)
                    remove_users = set(prev_user_permissions) - set(current_user_permissions)

                    for update_user in prevsusers:
                        user = User.objects.get(email=update_user["prevuser"])
                        if update_user["userpermission"] == "view":
                            remove_perm('change_folder', user, folder)
                            sub_files = File.objects.filter(folder=folder)
                            if len(sub_files)>0:
                                for subfile in sub_files:
                                    remove_perm('change_file', user, subfile)
                            sub_folders = Folder.objects.filter(parent_directory=folder) 
                            if len(sub_folders)>0:
                                for subfold in sub_folders:
                                    remove_perm('change_folder', user, subfold)

                            sub_files = File.objects.filter(folder__in=sub_folders)
                            if len(sub_files)>0:
                                remove_perm('change_file', user, sub_files)

                            while sub_folders or sub_files:
                                sub_folders = Folder.objects.filter(parent_directory__in=sub_folders)
                                if len(sub_folders)>0:
                                    for subfold in sub_folders:
                                        remove_perm('change_folder', user, subfold)

                                if len(sub_files)>0:
                                    sub_files = File.objects.filter(folder__in=sub_folders)
                                    for subfile in sub_files:
                                        remove_perm('change_file', user, subfile)

                        if update_user["userpermission"] == "edit":
                            assign_perm('change_folder', user, folder)
                            sub_files = File.objects.filter(folder=folder)
                            if len(sub_files)>0:
                                for subfile in sub_files:
                                    assign_perm('change_file', user, subfile)
                            sub_folders = Folder.objects.filter(parent_directory=folder) 
                            if len(sub_folders)>0:
                                for subfold in sub_folders:
                                    assign_perm('change_folder', user, subfold)

                            sub_files = File.objects.filter(folder__in=sub_folders)
                            if len(sub_files)>0:
                                assign_perm('change_file', user, sub_files)

                            while sub_folders or sub_files:
                                sub_folders = Folder.objects.filter(parent_directory__in=sub_folders)
                                if len(sub_folders)>0:
                                    for subfold in sub_folders:
                                        assign_perm('change_folder', user, subfold)

                                if len(sub_files)>0:
                                    sub_files = File.objects.filter(folder__in=sub_folders)
                                    for subfile in sub_files:
                                        assign_perm('change_file', user, subfile)

                    if len(remove_users) > 0:
                        for user in remove_users:
                            remove_perm('change_folder', user, folder)
                            remove_perm('view_folder',user, folder)
                            remove_perm('custom_folder',user, folder)

                            sub_files = File.objects.filter(folder=folder)
                            if len(sub_files)>0:
                                for subfile in sub_files:
                                    remove_perm('change_file', user, subfile)
                                    remove_perm('view_file',user, subfile) 

                            sub_folders = Folder.objects.filter(parent_directory=folder) 
                            if len(sub_folders)>0:
                                for subfold in sub_folders:
                                    remove_perm('change_folder', user, subfold)
                                    remove_perm('view_folder',user, subfold) 

                            sub_files = File.objects.filter(folder__in=sub_folders)
                            if len(sub_files)>0:
                                remove_perm('change_file', user, sub_files)
                                remove_perm('view_file',user, sub_files)

                            while sub_folders or sub_files:
                                sub_folders = Folder.objects.filter(parent_directory__in=sub_folders)
                                if len(sub_folders)>0:
                                    for subfold in sub_folders:
                                        remove_perm('change_folder', user, subfold)
                                        remove_perm('view_folder',  user, subfold)

                                if len(sub_files)>0:
                                    sub_files = File.objects.filter(folder__in=sub_folders)
                                    for subfile in sub_files:
                                        remove_perm('change_file', user, subfile)
                                        remove_perm('view_file',user, subfile)


                if users:
                    assign_user = User.objects.filter(id__in=users)
                    if permission == "edit":
                        assign_perm('change_folder', assign_user, folder)
                        
                    assign_perm('view_folder',  assign_user, folder)
                    assign_perm('custom_folder', assign_user, folder)

                    sub_files = File.objects.filter(folder=folder)
                    if len(sub_files)>0:
                        for subfile in sub_files:
                            if permission == "edit":
                                assign_perm('change_file', assign_user, subfile)
                            assign_perm('view_file',assign_user, subfile) 

                    sub_folders = Folder.objects.filter(parent_directory=folder)
                    if len(sub_folders)>0:
                        for subfold in sub_folders:
                            if permission == "edit":
                                assign_perm('change_folder', assign_user, subfold)
                            assign_perm('view_folder',  assign_user, subfold)
                    sub_files = File.objects.filter(folder__in=sub_folders)
            
                    if len(sub_files)>0:
                        for subfile in sub_files:
                            if permission == "edit":
                                assign_perm('change_file', assign_user, subfile)
                            assign_perm('view_file',  assign_user, subfile)
                    while sub_folders:
                        sub_folders = Folder.objects.filter(parent_directory__in=sub_folders)
                        if len(sub_folders)>0:
                            for subfold in sub_folders:
                                if permission == "edit":
                                    assign_perm('change_folder', assign_user, subfold)
                                assign_perm('view_folder',  assign_user, subfold)
                        sub_files = File.objects.filter(folder__in=sub_folders)
                        if len(sub_files)>0:
                            for subfile in sub_files:
                                if permission == "edit":
                                    assign_perm('change_file', assign_user, subfile)
                                assign_perm('view_file',  assign_user, subfile)
                
        if type =="file" :
            file = File.objects.get(id= request.data.get("id"))
            perm = request.user.has_perm('change_folder', file)
            if perm:     
                if "prevsusers" in request.data:
                    prev_user_permissions = get_users_with_perms(file, attach_perms=True).keys()
                    current_user_permissions =  [ sub['prevuser'] for sub in prevsusers ] 
                    current_user_permissions = User.objects.filter(email__in=current_user_permissions)
                    remove_users = set(prev_user_permissions) - set(current_user_permissions)

                    for update_user in prevsusers:
                        user = User.objects.get(email=update_user["prevuser"])
                        if update_user["userpermission"] == "view":
                            remove_perm('change_file', user, file)

                        if update_user["userpermission"] == "edit":
                            assign_perm('change_file', user, file)
                           
                    if len(remove_users) > 0:
                        for user in remove_users:
                            remove_perm('change_file', user, file)
                            remove_perm('view_file',user, file)
                            remove_perm('custom_file',user, file)

                if users:
                    assign_user = User.objects.filter(id__in=users)
                    if permission == "edit":
                        assign_perm('change_file', assign_user, file)
                    assign_perm('view_file',  assign_user, file)
                    assign_perm('custom_file', assign_user, file)

                           
        return Response({"status:ok"}, status=status.HTTP_200_OK)

class ManageFolderView(APIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]
    def post(self, request):
        folder_serializer = FolderDetailSerialiser(data=request.data)

        if folder_serializer.is_valid():
            folder  = folder_serializer.save()
            assign_perm("change_folder",request.user,folder)
            assign_perm("view_folder",request.user,folder)
            
            if not folder.parent_directory:
                assign_perm("custom_folder",request.user,folder)
            if folder.parent_directory:
                userList = get_users_with_perms(folder.parent_directory, attach_perms=True)       
                
                for user, permissions in userList.items():
                    user = User.objects.get(email=user)
                    if "change_folder" in permissions:
                        assign_perm("change_folder",user,folder)
                    if "view_folder" in permissions:
                        assign_perm("view_folder",user,folder)

            return Response({"status:ok"}, status=status.HTTP_200_OK)
            # return Response(folder_serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(folder_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        id = request.GET.get('id')
        folder = Folder.objects.get(id=id)
        folder_serializer = FolderDetailSerialiser(
            folder, data=request.data, partial=True)
        if folder_serializer.is_valid():
            folder_serializer.save()
            return Response({"status:ok"}, status=status.HTTP_200_OK)
            # return Response(folder_serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(folder_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        id = request.GET.get('id')
        folder = get_object_or_404(Folder, id=id)
        folder.delete()
        return Response({"status:ok"}, status=status.HTTP_200_OK)


class ManageFileView(APIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def post(self, request):
        file_serializer = FileSerialiser(data=request.data)
        if file_serializer.is_valid():
            file = file_serializer.save()
            assign_perm("change_file",request.user,file)
            assign_perm("view_file",request.user,file)
            
            if not file.folder:
                assign_perm("custom_file",request.user,file)

            if file.folder:
                userList = get_users_with_perms(file.folder, attach_perms=True)       
                
                for user, permissions in userList.items():
                    user = User.objects.get(email=user)
                    if "change_folder" in permissions:
                        assign_perm("change_file",user,file)
                    if "view_folder" in permissions:
                        assign_perm("view_file",user,file)

            return Response({"status:ok"}, status=status.HTTP_200_OK)
            # return Response(file_serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        id = request.GET.get('id')
        file = File.objects.get(id=id)
        file_serializer = FileSerialiser(file, data=request.data, partial=True)
        if file_serializer.is_valid():
            file_serializer.save()
            return Response({"status:ok"}, status=status.HTTP_200_OK)
            # return Response(file_serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        id = request.GET.get('id')
        file = get_object_or_404(File, id=id)
        file.delete()
        return Response({"status:ok"}, status=status.HTTP_200_OK)

