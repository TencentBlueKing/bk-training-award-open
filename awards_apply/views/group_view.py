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
                return JsonResponse(false_code("组名被占用，请换一个吧"))
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
            GroupUser.objects.get(group_id=group_id, username=request.user.username)
            return JsonResponse(false_code("您已加入该组，无需再次申请"))
        except GroupUser.DoesNotExist:
            # 找不到说明未加入组，可以进行申请
            pass
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
        group_id = request.data.get("group_id")
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
        status = request.GET.get("status")
        if status is not None:
            try:
                status = int(status)
            except ValueError:
                status = None

        # 未传组id就获取当前用户所有的审批
        if group_id is None:
            group_ids = Group.objects.filter(secretary=request.user.username).values_list("id", flat=True)
            group_applies = GroupApply.objects.filter(group_id__in=group_ids)
        else:
            try:
                Group.objects.get(id=group_id, secretary=request.user.username)
            except Group.DoesNotExist:
                return JsonResponse(false_code("对应组不存在或没有权限"))
            group_applies = GroupApply.objects.filter(group_id=group_id)
        if status is not None:
            group_applies.filter(status=status)
        return JsonResponse(success_code([apply.to_json() for apply in group_applies]))

    # 批量审批入组请求
    def post(self, request):
        apply_ids = request.data.get("apply_ids")
        if not isinstance(apply_ids, list):
            return JsonResponse(value_exception())
        status = request.data.get("is_allow")
        if status is None:
            return JsonResponse(value_exception())
        # 1: 通过，2: 未通过
        status = 1 if status else 2

        # 尝试找到所有的申请
        try:
            applications = GroupApply.objects.filter(id__in=apply_ids)
        except GroupApply.DoesNotExist:
            return JsonResponse(false_code("未找到对应的申请"))
        # 如果存在无效的申请直接返回
        if len(applications) != len(apply_ids):
            return JsonResponse(false_code("存在无效的申请"))

        # 如果存在无权限组对应的申请也直接返回
        group_secretary = Group.objects.filter(id__in=applications.values_list("group_id", flat=True))\
            .values_list("secretary", flat=True)
        group_secretary = set(group_secretary)
        if len(group_secretary) != 1 or group_secretary.pop() != request.user.username:
            return JsonResponse(false_code("缺少权限"))

        # 通过申请->将对应的用户添加到组员表中
        if status:
            new_members = []
            for apply in applications:
                new_members.append(GroupUser(
                    username=apply.username,
                    display_name=apply.display_name,
                    group_id=apply.group_id
                ))
            GroupUser.objects.bulk_create(new_members)
        applications.update(status=status, update_time=datetime.datetime.now())
        status = "通过" if status == 1 else "拒绝"

        # 创建消息通知
        new_notifications = []
        for apply in applications:
            new_notifications.append(Notification(
                group_id=apply.group_id,
                group_name=apply.group_name,
                action_type=0,
                action_target=apply.username,
                action_username=request.user.username,
                action_display_name=request.user.nickname,
                message=f"{status}了您的入组申请"
            ))
        Notification.objects.bulk_create(new_notifications)
        return JsonResponse(success_code(None))

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
        return JsonResponse(
            success_code(None, f"已将{group_user.username}({group_user.display_name})移出{group.full_name}"))


class GroupAllView(APIView):
    # 获取所有未加入的组信息
    def get(self, request):
        username = request.user.username
        groups = Group.objects.exclude(id__in=GroupUser.objects.filter(username=username).values_list("group_id", flat=True))
        return JsonResponse(success_code([g.to_json() for g in groups]))
