from django.contrib import admin
from .models import Category, Folder, File
from guardian.admin import GuardedModelAdmin
# Register your models here.
# admin.site.register(Category)


class CategoryAdmin(GuardedModelAdmin):
    list_display = ('name', 'slug', 'created_date')
    list_filter = ('created_date',)

class FolderAdmin(GuardedModelAdmin):
    list_display = ('name', 'parent_directory', 'category')

class FileAdmin(GuardedModelAdmin):
    list_display = ('name', 'folder', 'category')


admin.site.register(Category, CategoryAdmin)
admin.site.register(Folder,FolderAdmin)
admin.site.register(File,FileAdmin)

