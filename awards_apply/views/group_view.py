#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time     : 2022/3/17 10:35
# @Remarks  : 组相关操作
from django.db import IntegrityError
from django.http import JsonResponse
from rest_framework.views import APIView

from awards_apply.serializers.group_serializers import GroupSerializers
from awards_apply.utils.const import success_code, false_code, value_exception


class GroupView(APIView):
    def post(self, request, *args, **kwargs):
        group_info = {
            "full_name": request.data["group_name"],
            "secretary": request.user.username,
            "secretary_display_name": request.user.nickname
        }

        group = GroupSerializers(data=group_info)
        if group.is_valid():
            try:
                # TODO 重名时尝试创建数据，失败时也会导致占用自增id
                group = group.save()
                return JsonResponse(success_code(group.to_json()))
            except IntegrityError:
                return JsonResponse(false_code("该组已存在，您可直接申请加入"))
        else:
            return JsonResponse(value_exception())
