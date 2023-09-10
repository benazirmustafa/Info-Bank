from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *
# from guardian.serializers import ObjectPermissionsAssignmentMixin
from guardian.shortcuts import get_objects_for_user
from itertools import chain
from django.db.models import Q

    

class FolderSerialiser(serializers.ModelSerializer):
    permission = serializers.SerializerMethodField(
        "get_permission", required=False)
    created_by_name = serializers.CharField(source="created_by.get_full_name",required=False )
    def get_permission(self, instance):
        if self.context:
            if self.context['user'].has_perm('change_folder', instance) :
                return "edit"
            elif self.context['user'].has_perm('view_folder', instance) :
                return "view"
          
        return None
    class Meta:
        model = Folder
        fields = "__all__"


class FileSerialiser(serializers.ModelSerializer):
    permission = serializers.SerializerMethodField(
        "get_permission", required=False)
    created_by_name = serializers.CharField(source="created_by.get_full_name",required=False )
    def get_permission(self, instance):
        if self.context:
            if self.context['user'].has_perm('change_file', instance) :
                return "edit"
            elif self.context['user'].has_perm('view_file', instance) :
                return "view"
          
        return None
    class Meta:
        model = File
        fields = "__all__"


class FolderDetailSerialiser(serializers.ModelSerializer):
    files = serializers.SerializerMethodField(
        "get_files", required=False)
    folders = serializers.SerializerMethodField(
        "get_folders", required=False)
    created_by_name = serializers.CharField(source="created_by.get_full_name",required=False )
    category_name = serializers.CharField(
        source='category.name', required=False)
    category_slug = serializers.CharField(
        source='category.slug', required=False)

    def get_files(self, instance):
        files = instance.file_set.all()
        files = get_objects_for_user(self.context['user'], "view_file", files)
        files_serializer = FileSerialiser(files,context={'user':self.context['user']}, many=True)
        return files_serializer.data

    def get_folders(self, instance):
        folders = instance.folder_set.all()
        folders = get_objects_for_user(self.context['user'], "view_folder", folders)        
        folders_serializer = FolderSerialiser(folders,context={'user':self.context['user']}, many=True)
        return folders_serializer.data

    class Meta:
        model = Folder
        fields = "__all__"


class CategoryDetailsSerialiser(serializers.ModelSerializer):
    folders = serializers.SerializerMethodField(
        "get_folders", required=False)
    files = serializers.SerializerMethodField(
        "get_files", required=False)
    category_name = serializers.CharField(source='name', required=False)
    category_slug = serializers.CharField(
        source='slug', required=False)
    
    def get_files(self, instance):
        files = instance.file_set.filter(folder=None)
        
        if self.context['user'].is_superuser:
            if self.context['type'] == "personal":
                files = get_objects_for_user(self.context['user'], "view_file", files).filter(created_by=self.context['user'])
            elif self.context['type'] == "shared":
                files = get_objects_for_user(self.context['user'], "view_file", files).filter(~Q(created_by=self.context['user']))
        
        else:
            if self.context['type'] == "personal":
                files = get_objects_for_user(self.context['user'], 'infobank.custom_file').filter(category=instance.id).filter(created_by=self.context['user'])
            elif self.context['type'] == "shared":
                files = get_objects_for_user(self.context['user'], 'infobank.custom_file').filter(category=instance.id).filter(~Q(created_by=self.context['user']))

        files_serializer = FileSerialiser(files,context={'user':self.context['user']}, many=True)
        return files_serializer.data

    def get_folders(self, instance):
        folders = instance.folder_set.filter(parent_directory=None)
       
        if self.context['user'].is_superuser:
            if self.context['type'] == "personal":
                folders = get_objects_for_user(self.context['user'], "view_folder", folders).filter(created_by=self.context['user'])
            elif self.context['type'] == "shared":
                folders = get_objects_for_user(self.context['user'], "view_folder", folders).filter(~Q(created_by=self.context['user']))
        else:
            if self.context['type'] == "personal":
                folders = get_objects_for_user(self.context['user'], 'infobank.custom_folder').filter(category=instance.id).filter(created_by=self.context['user'])
            elif self.context['type'] == "shared":
                folders = get_objects_for_user(self.context['user'], 'infobank.custom_folder').filter(category=instance.id).filter(~Q(created_by=self.context['user']))

        folders_serializer = FolderSerialiser(folders,context={'user':self.context['user']} , many=True)
        return folders_serializer.data

    class Meta:
        model = Category
        fields = "__all__"
