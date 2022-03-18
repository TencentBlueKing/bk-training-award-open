#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time     : 2022/3/18 21:56
# @Remarks  : 消息处理
import datetime

from django.http import JsonResponse
from rest_framework.views import APIView

from awards_apply.models import Notification
from awards_apply.utils.const import success_code, false_code


class MessageView(APIView):
    # 获取自己所有的消息
    def get(self, request):
        username = request.user.username
        msgs = Notification.objects.filter(action_target=username)
        return JsonResponse(success_code([m.to_json() for m in msgs]))

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
