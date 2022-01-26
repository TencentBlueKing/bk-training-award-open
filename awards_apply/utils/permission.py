from rest_framework import permissions

from awards_apply.models import Admin
from awards_apply.utils.const import permission_denied


class AssignSecretaryPermission(permissions.BasePermission):
    """
    指派秘书权限校验
    """

    message = permission_denied()

    def has_permission(self, request, view):
        has_permission = Admin.objects.filter(
            admin_username=request.user.username
        ).exists()
        return has_permission
