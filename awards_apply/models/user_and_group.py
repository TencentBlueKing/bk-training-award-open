#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time     : 2022/3/16 16:17
# @Remarks  : 用户表和组表相关数据表

from django.db import models


# 创建时间和更新时间基类
class TimeBasic(models.Model):
    create_time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    update_time = models.DateTimeField(auto_now=True, verbose_name="更新时间")

    class Meta:
        abstract = True


class User(TimeBasic):
    username = models.CharField(max_length=128, unique=True, verbose_name="用户账号")
    display_name = models.CharField(max_length=128, null=True, blank=True, verbose_name="用户姓名")
    phone = models.CharField(max_length=30, null=True, blank=True, verbose_name="电话号码")
    email = models.EmailField(null=True, blank=True, verbose_name="邮箱")

    def __str__(self):
        return self.username

    def to_json(self):
        return {
            "user_id": self.id,
            "username": self.username,
            "display_name": self.display_name,
            "phone": self.phone,
            "email": self.email
        }


class Group(TimeBasic):
    full_name = models.CharField(max_length=128, unique=True, verbose_name="组名字")
    secretary = models.CharField(max_length=128, verbose_name="组秘书账号")
    secretary_display_name = models.CharField(max_length=128, verbose_name="组秘书姓名")

    def __str__(self):
        return "组名：" + self.full_name

    def to_json(self):
        return {
            "group_id": self.id,
            "full_name": self.full_name,
            "secretary": self.secretary,
            "secretary_display_name": self.secretary_display_name
        }


class GroupUser(models.Model):
    username = models.CharField(max_length=128, verbose_name="组成员账号")
    display_name = models.CharField(max_length=128, verbose_name="组成员姓名")
    group_id = models.IntegerField(verbose_name="组id")

    class Meta:
        unique_together = ("group_id", "username")

    def __str__(self):
        return f"{self.group_id}组{self.username}({self.display_name})"


class GroupApply(TimeBasic):
    group_id = models.IntegerField(verbose_name="组id")
    group_name = models.CharField(max_length=128, unique=True, verbose_name="组名字")
    username = models.CharField(max_length=128, verbose_name="组成员账号")
    display_name = models.CharField(max_length=128, verbose_name="组成员姓名")
    APPLY_STATE = [
        (0, "待审核"),
        (1, "已通过"),
        (2, "未通过"),
    ]
    status = models.IntegerField(choices=APPLY_STATE, default=0, verbose_name="申请状态")
    approver = models.CharField(max_length=128, null=True, blank=True, verbose_name="审批人账号")
    approver_display_name = models.CharField(max_length=128, null=True, blank=True, verbose_name="审批人姓名")

    class Meta:
        unique_together = ("group_id", "username")

    def __str__(self):
        return f"{self.username}({self.display_name})申请加入 {self.group_name}: {self.get_status_display()}"

    def to_json(self):
        return {
            "apply_id": self.id,
            "group_id": self.group_id,
            "group_name": self.group_name,
            "username": self.username,
            "display_name": self.display_name,
            "status": self.get_status_display(),
            "create_time": self.create_time,
            "update_time": self.update_time
        }


class Notification(TimeBasic):
    group_id = models.IntegerField(verbose_name="组id")
    group_name = models.CharField(max_length=128, verbose_name="组名字")
    NOTIFY_TYPE = [
        (0, "group_user"),  # 组管理信息
        (1, "award")  # 奖项管理信息
    ]
    action_type = models.IntegerField(choices=NOTIFY_TYPE, verbose_name="消息类型")
    action_target = models.CharField(max_length=128, verbose_name="通知对象账号")
    action_username = models.CharField(max_length=128, verbose_name="该操作处理人账号")
    action_display_name = models.CharField(max_length=128, verbose_name="该操作处理人姓名")
    message = models.CharField(max_length=128, verbose_name="消息主体")  # 比如已通过您的申请
    is_read = models.BooleanField(default=False, verbose_name="是否已读")

    def __str__(self):
        return f"{self.group_name}: {self.action_username}({self.action_display_name}){self.message}"

    def to_json(self):
        return {
            "msg_id": self.id,
            "group_id": self.group_id,
            "group_name": self.group_name,
            "action_type": self.get_action_type_display(),
            "action_username": self.action_username,
            "action_display_name": self.action_display_name,
            "message": self.message,
            "is_read": self.is_read,
            "create_time": self.create_time,
            "update_time": self.update_time
        }


class GroupInvitation(TimeBasic):
    group_id = models.IntegerField(verbose_name="组id")
    username = models.CharField(max_length=128, verbose_name="受邀成员")

    class Meta:
        unique_together = ("group_id", "username")
