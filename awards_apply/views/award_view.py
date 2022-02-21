import operator
from django.core.paginator import EmptyPage
from django.db.models import Q
from django.http import JsonResponse
from django.shortcuts import render
from django.utils import timezone
from rest_framework.views import APIView
from awards_apply.utils.const import success_code, false_code, page_num_exception, value_exception, \
    object_not_exist_error
from awards_apply.serializers.award_serializers import AwardsSerializers, AwardsRecordSerializers
from awards_apply.models import Awards, AwardApplicationRecord
from awards_apply.utils.pagination import PagePagination
from awards_apply.utils.user_info import get_user_info

# 奖项的状态
AwardsStatus = {'not_start': 0, 'started': 1, 'end': 2}
# 奖项申请的状态
RecordStatus = {'wait': 0, 'pass': 1, 'not_pass': 2, 'draft': 3}


def home(request):
    """
    首页
    """
    return render(request, "index.html")


class AwardView(APIView):

    def get(self, request, *args, **kwargs):
        """获取用户未申请过的奖项"""
        user_info = get_user_info(request)
        now = timezone.now()
        # ids表示：当前用户申请过的所有申请记录（包括草稿和正式申请）中的所有奖项id列表
        ids = AwardApplicationRecord.objects.filter(application_users__contain={user_info['data']['id']: \
            user_info['data']['display_name']}).values_list("award_id")
        # valid_awards表示：符合规定时间内的，用户没申请过的奖项
        valid_awards = Awards.objects.exclude(id__in=ids).filter(start_time__lt=now).filter(end_time__gt=now).order_by(
            "id")
        pagination = PagePagination()
        try:
            pager_roles = pagination.paginate_queryset(queryset=valid_awards, request=request, view=self)
            ser = AwardsSerializers(instance=pager_roles, many=True)
            return JsonResponse(success_code(pagination.get_paginated_response(ser.data)))
        except EmptyPage:
            return JsonResponse(page_num_exception())
        except BaseException:
            return JsonResponse(value_exception())

    def post(self, request, *args, **kwargs):
        """创建奖项"""
        award = AwardsSerializers(data=request.data)
        if award.is_valid() is False:
            return JsonResponse(false_code(award.errors))
        award.save()
        return JsonResponse(success_code(award.data))

    def put(self, request, *args, **kwargs):
        """编辑奖项"""
        data = AwardsSerializers(data=request.data)
        if data.is_valid() is False:
            return JsonResponse(false_code(data.errors))
        try:
            Awards.objects.get(pk=data.initial_data['award_id'])
        except Awards.DoesNotExist:
            return JsonResponse(object_not_exist_error("award"))
        Awards.objects.filter(id=data.initial_data['award_id']).update(
            award_name=data.initial_data['award_name'],
            award_level=data.initial_data['award_level'],
            award_description=data.initial_data['award_description'],
            award_department_fullname=data.initial_data['award_department_fullname'],
            award_reviewers=data.initial_data['award_reviewers'],
            award_image=data.initial_data['award_image'],
            start_time=data.initial_data['start_time'],
            end_time=data.initial_data['end_time'],
            update_time=timezone.now()
        )
        award = Awards.objects.get(pk=data.initial_data['award_id'])
        ser = AwardsSerializers(instance=award)
        return JsonResponse(success_code(ser.data))

    def delete(self, request, *args, **kwargs):
        """删除奖项"""
        award_id = request.data.get('award_id')
        try:
            award = Awards.objects.get(pk=award_id)
        except Awards.DoesNotExist:
            return JsonResponse(object_not_exist_error("award"))
        if operator.not_(request.user.username == award.award_consultant):
            return JsonResponse(false_code("您不是该奖项负责人，无法删除该奖项"))
        award.delete()
        return JsonResponse(success_code('删除奖项成功'))


class RecordView(APIView):

    def get(self, request):
        """获取我的申请记录"""
        user_info = get_user_info(request)
        record = AwardApplicationRecord.objects.filter(application_users__contains={user_info['data']['id']: \
                user_info['data']['display_name']}).order_by('id')
        pagination = PagePagination()
        try:
            pager_roles = pagination.paginate_queryset(queryset=record, request=request, view=self)
            ser = AwardsRecordSerializers(instance=pager_roles, many=True)
            return JsonResponse(success_code(pagination.get_paginated_response(ser.data)))
        except EmptyPage:
            return JsonResponse(page_num_exception())
        except BaseException:
            return JsonResponse(value_exception())

    def put(self, request, *args, **kwargs):
        """撤回申请"""
        num = {"no_change": 0}
        award_apply_record_id = request.data.get('id')
        award_apply_record_id = int(award_apply_record_id)
        record = AwardApplicationRecord.objects.filter(id=award_apply_record_id).update(
            approval_state=RecordStatus['draft'])
        if record is num["no_change"]:
            return JsonResponse(false_code("修改申请记录失败，该奖项的申请装填已经是草稿或奖项id不存在"))
        return JsonResponse(success_code({}))

    def post(self, request, *args, **kwargs):
        """保存草稿和正式申请"""
        # 校验请求参数
        award_record = AwardsRecordSerializers(data=request.data)
        if award_record.is_valid() is False:
            return JsonResponse(false_code(award_record.errors))
        record = award_record.validated_data
        application_users = AwardApplicationRecord.objects.filter(award_id=record["award_id"]). \
            filter(~Q(approval_state=RecordStatus['draft'])).values_list("application_users")
        # 判断用户是否已经申请过该奖项
        for item in application_users:
            for key in item[0]:
                # 可能存在重名用户，所以只对申请用户的id做判断
                if key in record["application_users"].keys():
                    return JsonResponse(false_code("指定用户已申请过该奖项"))
        award_record.save()
        return JsonResponse(success_code({}))


class AvailableAwardsView(APIView):

    def get(self, request):
        """获取可申请的奖项（所属部门的）"""
        user_info = get_user_info(request)
        # 获取用户所在的组列表
        user_departments = []
        for item in user_info['data']['departments']:
            user_departments.append(item['full_name'])
        now = timezone.now()
        valid_awards = Awards.objects.filter(award_department_fullname__in=user_departments).filter(
            Q(start_time__lt=now) & Q(end_time__gt=now)).order_by('id')
        pagination = PagePagination()
        try:
            pager_roles = pagination.paginate_queryset(queryset=valid_awards, request=request, view=self)
            ser = AwardsSerializers(instance=pager_roles, many=True)
            return JsonResponse(success_code(pagination.get_paginated_response(ser.data)))
        except EmptyPage:
            return JsonResponse(page_num_exception())
        except BaseException:
            return JsonResponse(value_exception())


class ApplyedRecordView(APIView):

    def get(self, request):
        """获取用户已经获得的奖项"""
        user_info = get_user_info(request)
        record = AwardApplicationRecord.objects.filter(Q(approval_state=RecordStatus["pass"]) & \
            Q(application_users__contains={user_info['data']['id']: user_info['data']['display_name']})).order_by('id')
        pagination = PagePagination()
        try:
            pager_roles = pagination.paginate_queryset(queryset=record, request=request, view=self)
            ser = AwardsRecordSerializers(instance=pager_roles, many=True)
            return JsonResponse(success_code(pagination.get_paginated_response(ser.data)))
        except EmptyPage:
            return JsonResponse(page_num_exception())
        except BaseException:
            return JsonResponse(value_exception())
