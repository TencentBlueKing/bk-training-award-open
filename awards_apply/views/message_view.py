#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time     : 2022/3/18 21:56
# @Remarks  : 消息处理
import datetime
import math

from django.core.paginator import EmptyPage
from django.http import JsonResponse
from rest_framework.exceptions import NotFound
from rest_framework.views import APIView

from awards_apply.models import Notification
from awards_apply.serializers.notification_serializer import NotificationSerializers
from awards_apply.utils.const import success_code, false_code, page_num_exception, value_exception
from awards_apply.utils.pagination import PagePagination


class MessageView(APIView):
    # 获取自己所有的消息
    def get(self, request):
        username = request.user.username
        msgs = Notification.objects.filter(action_target=username).order_by("-update_time")
        pagination = PagePagination()
        try:
            pager_roles = pagination.paginate_queryset(queryset=msgs, request=request, view=self)
            ser = NotificationSerializers(instance=pager_roles, many=True)
            return JsonResponse(success_code(pagination.get_paginated_response(ser.data)))
        except EmptyPage:
            return JsonResponse(page_num_exception())
        except BaseException:
            return JsonResponse(value_exception())

    # 修改通知状态为已阅
    def put(self, request):
        msg_id = request.data.get("msg_id")
        update_status = Notification.objects \
            .filter(id=msg_id, action_target=request.user.username) \
            .update(is_read=True, update_time=datetime.datetime.now())
        if update_status:
            return JsonResponse(success_code("更新成功"))
        else:
            return JsonResponse(false_code("消息不存在"))
