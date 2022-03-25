from awards_apply.models import ApprovalRecord, ApprovalState
from awards_apply.models import AwardApplicationRecord as Application
from awards_apply.models import Group, Notification
from awards_apply.serializers.application_serializer import (
    ApplicationSerializer, ApprovalRecordSerializer)
from awards_apply.utils.const import object_not_exist_error, success_code
from awards_apply.utils.pagination import CommonPaginaation
from django.forms import model_to_dict
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.views import APIView

ApplicationState = {"pending": "0", "end": "1"}


class ApprovalView(APIView):
    # permission_classes = [ApprovalPermission]

    def get(self, request, *args, **kwargs):
        """我的审批: 查询我的审批列表"""
        approval_state = request.query_params["approval_status"]
        group_id = request.query_params.get("group_id")
        page = CommonPaginaation()
        if approval_state == ApplicationState["end"]:
            # 已审批
            queryset = ApprovalRecord.objects.filter(approval_user=request.user.username).order_by("approval_time")
            if group_id:
                queryset = queryset.filter(department_id=group_id).order_by("approval_time")
            queryset = page.paginate_queryset(queryset, request, self)
            serializer = ApprovalRecordSerializer(queryset, many=True)
            response = page.get_paginated_response(serializer.data)
            return Response(success_code(response.data))
        else:
            # 未审批
            approvaled_applications_id = ApprovalRecord.objects.filter(
                approval_user=request.user.username).values_list("application_id")
            approvaled_applications_id = [item[0] for item in approvaled_applications_id]
            queryset = Application.objects.filter(
                approval_users__contains=request.user.username).filter(
                approval_state=ApprovalState.review_pending.value[0]).filter(
                end_time__lt=timezone.now()).exclude(id__in=approvaled_applications_id).order_by("id")
            if group_id:
                queryset = queryset.filter(award_department_id=group_id).order_by("id")
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
            return Response(object_not_exist_error("申请"))
        result = serializer.update(application, serializer.validated_data, request.user.username)
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
