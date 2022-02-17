from awards_apply.models import Secretary
from awards_apply.serializers import SecretarySerializer
from awards_apply.utils.const import success_code
from awards_apply.utils.pagination import CommonPaginaation
from awards_apply.utils.permission import AssignSecretaryPermission
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet


class SecretaryViewSet(ModelViewSet):
    serializer_class = SecretarySerializer
    permission_classes = [AssignSecretaryPermission]
    queryset = Secretary.objects.all().order_by('id')
    lookup_field = "id"
    pagination_class = CommonPaginaation

    def list(self, request, *args, **kwargs):
        response = super(SecretaryViewSet, self).list(request, *args, **kwargs)
        return Response(success_code(response.data))

    def create(self, request, *args, **kwargs):
        response = super(SecretaryViewSet, self).create(request, *args, **kwargs)
        return Response(success_code(response.data))

    def update(self, request, *args, **kwargs):
        response = super(SecretaryViewSet, self).update(request, *args, **kwargs)
        return Response(success_code(response.data))
