from awards_apply.models import Admin, AwardApplicationRecord
from awards_apply.utils.const import permission_denied
from rest_framework import permissions


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


class ApprovalPermission(permissions.BasePermission):
    """
    审批权限校验
    """

    message = permission_denied()

    def has_permission(self, request, view):
        if request.method == "GET":
            return True
        application = AwardApplicationRecord.objects.filter(id=request.data["id"]).first()
        if application:
            if request.user.username in application.approval_users[application.approval_turn]:
                return True
        return False
