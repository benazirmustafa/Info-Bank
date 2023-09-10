import os
from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericRelation
from django.utils.text import slugify
from appauth.models import User
from django.contrib.auth.models import Group


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, null=True, blank=True)
    description = models.CharField(max_length=250, null=True, blank=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    owners = models.ManyToManyField(User, blank=True) 

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super(Category, self).save(*args, **kwargs)


class Folder(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, null=True, blank=True)
    description = models.CharField(
        max_length=250, null=True, blank=True, default="")
    category = models.ForeignKey(
        Category, null=True, blank=True, on_delete=models.CASCADE)
    parent_directory = models.ForeignKey(
        'self', null=True, blank=True, on_delete=models.CASCADE)
    created_by = models.ForeignKey(
        User, null=True, on_delete=models.SET_NULL, related_name='folder_creator')
    created_date = models.DateTimeField(auto_now_add=True)
    owners = models.ManyToManyField(
        User, blank=True)
    
    def __str__(self):
        if not self.parent_directory:
            return "{0} > {1}".format(self.category.name, self.name)
        else:
            pwd = self
            dir_list = []
            dir_list.insert(0, self.category.name)
            dir_list.insert(1, pwd.name)
            while pwd.parent_directory != None:
                dir_list.insert(1, pwd.parent_directory.name)
                pwd = pwd.parent_directory

            return " > ".join(dir_list)

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super(Folder, self).save(*args, **kwargs)
    class Meta:
        permissions = (
            ('custom_folder', 'Custom folder'),
        )

def department_directory_path(instance, filename):
    if instance.folder:
        return '{0}/{1}/{2}'.format(instance.category.name, instance.folder.name, filename)
    else:
        return '{0}/{1}'.format(instance.category.name, filename)


class File(models.Model):
    name = models.CharField(max_length=100)
    description = models.CharField(
        max_length=250, null=True, blank=True, default="")
    file = models.FileField(upload_to=department_directory_path)
    folder = models.ForeignKey(
        Folder, null=True, blank=True, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, null=True, on_delete=models.CASCADE)
    created_by = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    def extension(self):
        name, extension = os.path.splitext(self.file.name)
        return extension
    class Meta:
        permissions = (
            ('custom_file', 'Custom file'),
        )