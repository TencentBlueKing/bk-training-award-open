#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time     : 2022/3/17 10:35
# @Remarks  : 组相关操作
import datetime

from django.db import IntegrityError
from django.http import JsonResponse
from rest_framework.views import APIView

from awards_apply.models import Group, GroupUser, GroupApply, Notification, User
from awards_apply.serializers.group_serializers import GroupSerializers
from awards_apply.utils.const import success_code, false_code, value_exception
from awards_apply.utils.user_info import copy_user_from_bk


class GroupView(APIView):
    # 获取用户所在组列表
    def get(self, request):
        username = request.user.username
        groups = GroupUser.objects.filter(username=username).values_list("group_id", flat=True)
        groups_info = Group.objects.filter(id__in=groups)
        return JsonResponse(success_code([g.to_json() for g in groups_info]))

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
            except IntegrityError:
                return JsonResponse(false_code("组名被占用，请选择其他组名字"))
            GroupUser.objects.create(
                group_id=group.id,
                username=request.user.username,
                display_name=request.user.nickname
            )
            return JsonResponse(success_code(group.to_json()))
        else:
            return JsonResponse(value_exception())

    def put(self, request):
        group_id = request.data.get("group_id")
        group_name = request.data.get("group_name")
        try:
            update_status = Group.objects.filter(id=group_id, secretary=request.user.username) \
                .update(full_name=group_name, update_time=datetime.datetime.now())
        except Group.DoesNotExist:
            return JsonResponse(false_code("未找到对应的组"))
        if update_status == 1:
            return JsonResponse(success_code("修改组名字成功"))
        else:
            return JsonResponse(false_code("未找到对应的组"))

    # TODO 解散组


class GroupUserView(APIView):
    # 获取小组的详细信息
    def get(self, request):
        group_id = request.GET.get("group_id")
        try:
            group = Group.objects.get(id=group_id)
        except Group.DoesNotExist:
            return JsonResponse(false_code("不存在对应的组，请核对组id"))
        # 组员信息
        group_members_username = GroupUser.objects.filter(group_id=group_id).values_list("username", flat=True)
        group_members = User.objects.filter(username__in=group_members_username)
        return JsonResponse(success_code([user.to_json() for user in group_members]))

    # 申请加入小组
    def post(self, request):
        group_id = request.data.get("group_id")
        try:
            group = Group.objects.get(id=group_id)
        except Group.DoesNotExist:
            return JsonResponse(false_code("不存在对应的组，请核对组id"))
        try:
            GroupApply.objects.create(
                group_id=group_id,
                group_name=group.full_name,
                username=request.user.username,
                display_name=request.user.nickname
            )
        except IntegrityError:
            return JsonResponse(false_code("您已申请过加入该组，请耐心等待组秘书审核"))

        Notification.objects.create(
            group_id=group_id,
            group_name=group.full_name,
            action_type=0,
            action_target=group.secretary,
            action_username=request.user.username,
            action_display_name=request.user.nickname,
            message="申请加入组"
        )
        return JsonResponse(success_code(None, "申请加入组成功"))

    # 退出小组
    def delete(self, request):
        group_id = request.GET.get("group_id")
        try:
            group = Group.objects.get(id=group_id)
        except (Group.DoesNotExist, GroupUser.DoesNotExist):
            return JsonResponse(false_code("不存在的组id"))
        if group.secretary == request.user.username:
            return JsonResponse(false_code("您是该组的秘书，请直接解散组"))
        try:
            GroupUser.objects.get(group_id=group_id, username=request.user.username).delete()
        except GroupUser.DoesNotExist:
            return JsonResponse(false_code("您未加入该组，或已退出"))
        Notification.objects.create(
            group_id=group_id,
            group_name=group.full_name,
            action_type=0,
            action_target=group.secretary,
            action_username=request.user.username,
            action_display_name=request.user.nickname,
            message="退出了组"
        )
        return JsonResponse(success_code(None, f"退出 {group.full_name} 成功"))


class GroupManageView(APIView):
    # 获取所有的申请
    def get(self, request):
        group_id = request.GET.get("group_id")
        try:
            Group.objects.get(id=group_id, secretary=request.user.username)
        except Group.DoesNotExist:
            return JsonResponse(false_code("对应组不存在或没有权限"))
        group_applies = GroupApply.objects.filter(group_id=group_id)
        return JsonResponse(success_code([apply.to_json() for apply in group_applies]))

    # 审批入组请求
    def post(self, request):
        apply_id = request.data.get("apply_id")
        status = request.data.get("is_allow")
        if status is None:
            return JsonResponse(value_exception())
        # 1: 通过，2: 未通过
        status = 1 if status else 2
        try:
            apply = GroupApply.objects.get(id=apply_id)
            group = Group.objects.get(id=apply.group_id, secretary=request.user.username)
        except (GroupApply.DoesNotExist, Group.DoesNotExist):
            return JsonResponse(false_code("未找到对应的申请"))
        apply.status = status
        apply.save()
        status = "通过" if status == 1 else "拒绝"
        Notification.objects.create(
            group_id=group.id,
            group_name=group.full_name,
            action_type=0,
            action_target=apply.username,
            action_username=request.user.username,
            action_display_name=request.user.nickname,
            message=f"{status}了您的入组申请"
        )
        msg = f"已{status}{apply.username}({apply.display_name})加入 {apply.group_name} 的申请"
        return JsonResponse(success_code(None, msg))

    # 转让组
    def put(self, request):
        # 新秘书如果是自己则直接返回成功
        new_secretary = request.data.get("new_secretary")
        if new_secretary == request.user.username:
            return JsonResponse(success_code("转让成功"))

        group_id = request.data.get("group_id")
        try:
            group = Group.objects.get(id=group_id, secretary=request.user.username)
        except Group.DoesNotExist:
            return JsonResponse(false_code("您没有对应组的权限"))
        # 尝试在项目用户表中查找新秘书，找不到去蓝鲸拉取
        try:
            user = User.objects.get(username=new_secretary)
        except User.DoesNotExist:
            user = copy_user_from_bk(request, new_secretary)
        group.secretary = user.username
        group.secretary_display_name = user.display_name
        group.save()
        Notification.objects.create(
            group_id=group_id,
            group_name=group.full_name,
            action_type=0,
            action_target=group.secretary,
            action_username=request.user.username,
            action_display_name=request.user.nickname,
            message="把组转让给你了"
        )
        return JsonResponse(success_code(None, f"转让组 {group.full_name} 给{user.username}({user.display_name})成功"))

    # 移除用户
    def delete(self, request):
        group_id = request.GET.get("group_id")
        username = request.GET.get("username")
        if username == request.user.username:
            return JsonResponse(false_code("不可将自己移出组"))
        try:
            group = Group.objects.get(id=group_id, secretary=request.user.username)
            group_user = GroupUser.objects.get(group_id=group_id, username=username)
        except Group.DoesNotExist:
            return JsonResponse(false_code("对应组不存在或没有权限"))
        except GroupUser.DoesNotExist:
            return JsonResponse(false_code("组内没有该用户"))
        group_user.delete()
        Notification.objects.create(
            group_id=group_id,
            group_name=group.full_name,
            action_type=0,
            action_target=username,
            action_username=request.user.username,
            action_display_name=request.user.nickname,
            message="把你移出了组"
        )
        return JsonResponse(success_code(None, f"已将{group_user.username}({group_user.display_name})移出{group.full_name}"))

