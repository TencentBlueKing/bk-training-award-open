from awards_apply.models import Admin, Secretary
from awards_apply.serializers import SecretarySerializer
from awards_apply.utils.const import success_code
from awards_apply.utils.pagination import CommonPaginaation
from awards_apply.utils.permission import AssignSecretaryPermission
from blueking.component.shortcuts import get_client_by_request
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet


class SecretaryViewSet(ModelViewSet):
    serializer_class = SecretarySerializer
    permission_classes = [AssignSecretaryPermission]
    lookup_field = "id"
    pagination_class = CommonPaginaation

    def get_queryset(self):
        if Admin.objects.filter(admin_username=self.request.user.username).exists():
            return Secretary.objects.all().order_by("id")
        return Secretary.objects.filter(
            secretaries__contains={"username": self.request.user.username}
        ).order_by("id")

    def list(self, request, *args, **kwargs):
        response = super(SecretaryViewSet, self).list(request, *args, **kwargs)
        return Response(success_code(response.data))

    def create(self, request, *args, **kwargs):
        response = super(SecretaryViewSet, self).create(request, *args, **kwargs)
        return Response(success_code(response.data))

    def update(self, request, *args, **kwargs):
        response = super(SecretaryViewSet, self).update(request, *args, **kwargs)
        return Response(success_code(response.data))


@api_view(["GET"])
def secretary_department(request, *args, **kwargs):
    """获取秘书可管理的组"""
    id_list = Secretary.objects.filter(
        secretaries__contains={"username": request.user.username}).values_list("group_id")
    if not id_list:
        return Response(success_code([]))
    id_list = [i[0] for i in id_list]
    client = get_client_by_request(request)
    department_list = client.usermanage.list_departments()
    for item in department_list["data"]["results"][::-1]:
        if item["id"] not in id_list:
            department_list["data"]["results"].remove(item)
    department_list["data"] = department_list["data"]["results"]
    return Response(department_list)
