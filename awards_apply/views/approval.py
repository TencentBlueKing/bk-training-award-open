from awards_apply.models import ApprovalState
from awards_apply.models import AwardApplicationRecord as Application
from awards_apply.models import Group, Notification
from awards_apply.serializers.application_serializer import \
    ApplicationSerializer
from awards_apply.utils.const import object_not_exist_error, success_code
from awards_apply.utils.pagination import CommonPaginaation
from django.forms import model_to_dict
from rest_framework.response import Response
from rest_framework.views import APIView


class ApprovalView(APIView):
    # permission_classes = [ApprovalPermission]

    def get(self, request, *args, **kwargs):
        """我的审批: 查询我的审批列表"""
        approval_state = request.query_params["approval_status"]
        group_id = request.query_params["group_id"]
        if approval_state:
            queryset = Application.objects.filter(
                approval_users__contains=request.user.username
            ).filter(approval_state__in=[ApprovalState.review_passed.value[0],
                                         ApprovalState.review_not_passed.value[0]]).order_by("id").filter(
                award_department_id=group_id
            ).order_by("id")
        else:
            queryset = Application.objects.filter(
                approval_users__contains=request.user.username
            ).filter(approval_state=ApprovalState.review_pending.value[0]).filter(
                award_department_id=group_id
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
        group = Group.objects.filter(pk=application.award_department_id).first()
        Notification.objects.create(
            **{
                "group_id": group.id,
                "group_name": group.full_name,
                "action_type": 0,
                "action_username": request.user.username,
                "action_display_name": request.user.nickname,
                "action_target": application.application_users[0],
                "message": "审批了你的申请"
            }
        )
        return Response(success_code(model_to_dict(result)))
