from django.contrib import admin
from accounts.models import Profile, Subscription, Plan
from django.contrib.auth.admin import UserAdmin as AuthUserAdmin

# Register your models here.
admin.site.register(Profile)
admin.site.register(Subscription)
admin.site.register(Plan)