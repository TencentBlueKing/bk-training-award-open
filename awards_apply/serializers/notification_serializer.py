#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time     : 2022/3/20 0:53
# @Remarks  : 通知消息序列化
from rest_framework import serializers


class NotificationSerializers(serializers.Serializer):
    id = serializers.IntegerField()
    group_id = serializers.IntegerField()
    group_name = serializers.CharField(max_length=128)
    action_type = serializers.IntegerField()
    action_target = serializers.CharField(max_length=128)
    action_username = serializers.CharField(max_length=128)
    action_display_name = serializers.CharField(max_length=128)
    message = serializers.CharField(max_length=128)
    is_read = serializers.BooleanField(default=False)
