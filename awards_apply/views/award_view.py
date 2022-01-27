from itertools import chain
from django.core.paginator import EmptyPage
from django.db.models import Q
from django.http import JsonResponse
from django.shortcuts import render
from django.utils import timezone
from rest_framework.views import APIView
from blueking.component.shortcuts import get_client_by_request
from awards_apply.utils.const import success_code, false_code, object_not_exist_error, page_num_exception, \
    value_exception
from awards_apply.serializers.award_serializers import AwardsSerializers, AwardsRecordSerializers
from awards_apply.models import Awards, AwardApplicationRecord
from awards_apply.utils.pagination import PagePagination

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
        request_user = request.user.username
        now = timezone.now()
        # ids表示：当前用户申请过的所有申请记录（包括草稿和正式申请）中的所有奖项id列表
        ids = AwardApplicationRecord.objects.filter(application_users__contain=request_user).values_list("award_id")
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


class RecordView(APIView):

    def get(self, request, *args, **kwargs):
        """撤回申请"""
        num = {"no_change": 0}
        award_apply_record_id = request.query_params['id']
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
        # 查询申请记录表中：指定奖项且正在申请的用户list,得到的结果是个二维数组。
        apply_list = AwardApplicationRecord.objects.filter(award_id=record["award_id"]). \
            filter(~Q(approval_state=RecordStatus['draft'])).values_list("application_users")
        # 数组扁平化
        had_applied_users = sum(list(chain.from_iterable(apply_list)), [])
        # 查询两个数组有没有共同的申请者
        same_person = [x for x in record["application_users"] if x in had_applied_users]
        if len(same_person):
            return JsonResponse(false_code("指定用户已申请过该奖项"))
        award_record.save()
        return JsonResponse(success_code({}))


class AvailableAwardsView(APIView):

    def get(self, request):
        """获取可申请的奖项（所属部门的）"""
        client = get_client_by_request(request)
        query_params = {"id": request.user.username}
        data = client.usermanage.retrieve_user(query_params)
        # 获取用户所在的组列表
        user_departments = []
        for item in data['data']['departments']:
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
        username = request.user.username
        record = AwardApplicationRecord.objects.filter(
            Q(APPROVAL_STATE == RecordStatus["pass"]) & Q(application_users__contains=username))
        pagination = PagePagination()
        try:
            pager_roles = pagination.paginate_queryset(queryset=record, request=request, view=self)
            ser = AwardsSerializers(instance=pager_roles, many=True)
            return JsonResponse(success_code(pagination.get_paginated_response(ser.data)))
        except EmptyPage:
            return JsonResponse(page_num_exception())
        except BaseException:
            return JsonResponse(value_exception())
