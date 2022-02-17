from awards_apply.models import AwardApplicationRecord as Application
from awards_apply.serializers.application_serializer import \
    ApplicationSerializer
from awards_apply.utils.const import object_not_exist_error, success_code
from awards_apply.utils.pagination import CommonPaginaation
from awards_apply.utils.permission import ApprovalPermission
from django.forms import model_to_dict
from rest_framework.response import Response
from rest_framework.views import APIView


class ApprovalView(APIView):
    permission_classes = [ApprovalPermission]

    def get(self, request, *args, **kwargs):
        """我的审批: 查询我的审批列表"""
        queryset = Application.objects.filter(
            approval_users__contains=request.user.username
        ).order_by("id")
        page = CommonPaginaation()
        queryset = page.paginate_queryset(queryset, request, self)
        serializer = ApplicationSerializer(
            queryset, many=True, context={"username": request.user.username}
        )
        response = page.get_paginated_response(serializer.data)
        response.data["results"] = [
            item["obj"] for item in response.data["results"] if item["obj"] is not None
        ]
        response.data["count"] = len(response.data["results"])
        return Response(success_code(response.data))

    def post(self, request, *args, **kwargs):
        """审批奖项"""
        serializer = ApplicationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        application = Application.objects.filter(
            id=serializer.validated_data["id"]
        ).first()
        if not application:
            return Response(object_not_exist_error("application"))
        result = serializer.update(application, serializer.validated_data)
        return Response(success_code(model_to_dict(result)))
