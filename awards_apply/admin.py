from awards_apply.models import Admin
from django.contrib import admin

# Register your models here.


class AdminDisplay(admin.ModelAdmin):
    list_display = ["id", "admin_username"]


admin.site.register(Admin, AdminDisplay)
