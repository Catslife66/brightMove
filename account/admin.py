from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import MyUser, Agent

# class AgentProfileInline(admin.StackedInline):
#     model = AgentProfile
#     can_delete = False
#     verbose_name_plural = 'agent profile'

# class UserAdmin(UserAdmin):
#     inlines = (AgentProfileInline,)

admin.site.register(MyUser)
admin.site.register(Agent)
