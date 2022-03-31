#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time     : 2022/3/18 21:56
# @Remarks  : 消息处理
import datetime

from awards_apply.models import Notification
from awards_apply.serializers.notification_serializer import \
    NotificationSerializers
from awards_apply.utils.const import (false_code, page_num_exception,
                                      success_code)
from awards_apply.utils.pagination import PagePagination
from django.http import JsonResponse
from rest_framework.exceptions import NotFound
from rest_framework.views import APIView


class MessageView(APIView):
    # 获取自己所有的消息
    def get(self, request):
        username = request.user.username
        msgs = Notification.objects.filter(action_target=username).order_by("is_read", "-update_time")
        pagination = PagePagination()
        try:
            pagination.page_size = int(request.GET.get("size", 10))
            pager_roles = pagination.paginate_queryset(queryset=msgs, request=request, view=self)
            ser = NotificationSerializers(instance=pager_roles, many=True)
            return JsonResponse(success_code(pagination.get_paginated_response(ser.data)))
        except ValueError:
            return JsonResponse(page_num_exception())
        except NotFound:
            return JsonResponse(page_num_exception())

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
