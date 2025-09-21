from rest_framework import permissions


class PropertyEditorPermissions(permissions.DjangoModelPermissions):
    def has_permission(self, request, view):
        user = request.user
        if user.is_agent: 
            return True
        return False
    
    def has_object_permission(self, request, view, obj):
        user = request.user.id
        if obj.agent.user_id == user:
            return True
        return False


class PropertyImageEditorPermissions(permissions.DjangoModelPermissions):
    def has_permission(self, request, view):
        user = request.user
        if user.is_agent: 
            return True
        return False
    
    def has_object_permission(self, request, view, obj):
        user = request.user.id
        if obj.property.agent.user_id == user:
            return True
        return False