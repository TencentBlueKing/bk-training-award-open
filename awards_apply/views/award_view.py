from awards_apply.models import (ApprovalState, AwardApplicationRecord, Awards,
                                 GroupUser, Notification)
from awards_apply.serializers.award_serializers import (
    AwardsRecordSerializers, AwardsSerializers)
from awards_apply.utils.const import (false_code, object_not_exist_error,
                                      page_num_exception, success_code,
                                      value_exception)
from awards_apply.utils.pagination import PagePagination
from django.core.paginator import EmptyPage
from django.db import transaction
from django.db.models import Q
from django.db.models.query import QuerySet
from django.forms import model_to_dict
from django.http import JsonResponse
from django.shortcuts import render
from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.views import APIView

# 奖项的状态
AwardsStatus = {'start': 0, 'end': 1}
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
        now = timezone.now()
        # ids表示：当前用户申请过的所有申请记录（包括草稿和正式申请）中的所有奖项id列表
        ids = AwardApplicationRecord.objects.filter(
            application_users__contain={"username": request.user.username}).exclude(
            approval_users__contains=request.user.username).values_list("award_id")
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
        print(GroupUser.objects.filter(group_id=request.data["award_department_id"]).values_list("username"))
        # 创建消息
        messages = [{
            "group_id": request.data["award_department_id"],
            "group_name": request.data["award_department_fullname"],
            "action_type": 1,
            "action_username": request.user.username,
            "action_display_name": request.user.nickname,
            "action_target":username[0],
            "message":"创建了奖项"
        } for username in GroupUser.objects.filter(
            group_id=request.data["award_department_id"]).values_list("username")]
        for item in messages:
            message = Notification(**item)
            message.save()
        return JsonResponse(success_code(award.data))

    def put(self, request, *args, **kwargs):
        """编辑奖项"""
        data = AwardsSerializers(data=request.data)
        award_id = data.initial_data['award_id']
        if not data.is_valid():
            return JsonResponse(false_code(data.errors))
        if not Awards.objects.filter(pk=award_id).exists():
            return JsonResponse(object_not_exist_error("award"))
        data.initial_data['update_time'] = timezone.now()
        data.initial_data.pop('award_id', None)
        Awards.objects.filter(pk=award_id).update(**data.initial_data)
        award = Awards.objects.get(pk=award_id)
        ser = AwardsSerializers(instance=award)
        return JsonResponse(success_code(ser.data))

    def delete(self, request, *args, **kwargs):
        """删除奖项"""
        award_id = request.data.get('award_id')
        try:
            award = Awards.objects.get(pk=award_id)
        except Awards.DoesNotExist:
            return JsonResponse(object_not_exist_error("award"))
        award.delete()
        return JsonResponse(success_code(None, message='删除奖项成功'))


class RecordView(APIView):

    def get(self, request):
        """获取我的申请记录"""
        queryset = {
            "1": ApprovalState.review_pending.value[0],
            "2": ApprovalState.review_not_passed.value[0],
            "3": ApprovalState.review_passed.value[0]
        }
        status = request.query_params["apply_status"]
        record = AwardApplicationRecord.objects.filter(
            application_users__contains={"username": request.user.username}).filter(
            award_department_id=request.query_params["group_id"]
        ).filter(approval_state=queryset[status]).order_by("id")
        pagination = PagePagination()
        try:
            pager_roles = pagination.paginate_queryset(queryset=record, request=request, view=self)
            ser = AwardsRecordSerializers(instance=pager_roles, many=True)
            return JsonResponse(success_code(pagination.get_paginated_response(ser.data)))
        except EmptyPage:
            return JsonResponse(page_num_exception())
        except BaseException:
            return JsonResponse(value_exception())

    def delete(self, request, *args, **kwargs):
        """撤回申请"""
        award_apply_record_id = request.data.get('id')
        award_apply_record_id = int(award_apply_record_id)
        award = AwardApplicationRecord.objects.filter(pk=award_apply_record_id).filter(
            application_users__contains={"username": request.user.username}).first()
        if not award:
            return JsonResponse(false_code("您不是申请用户，无法撤回申请"))
        AwardApplicationRecord.objects.filter(pk=award_apply_record_id).update(
            approval_state=RecordStatus['draft'])
        return JsonResponse(success_code({}))

    def post(self, request, *args, **kwargs):
        """保存草稿和正式申请"""
        # 校验请求参数
        award_record = AwardsRecordSerializers(data=request.data)
        award_record.is_valid(raise_exception=True)
        record = award_record.validated_data
        application = AwardApplicationRecord.objects.filter(award_id=record["award_id"]).filter(
            ~Q(approval_state=RecordStatus['draft'])
            & ~Q(approval_state=RecordStatus['not_pass'])
        ).filter(application_users__contains={"username": request.user.username}).first()
        # 判断用户是否已经申请过该奖项
        if application:
            return JsonResponse(false_code("指定用户已申请过该奖项"))
        record.update({"application_users": [{"username": request.user.username,
                                              "display_name": request.user.nickname}]})
        award_record.create(record)
        return JsonResponse(success_code(None))

    def put(self, request):
        id = request.query_params.get("id")
        application = AwardApplicationRecord.objects.filter(approval_state=RecordStatus['draft']).filter(pk=id)
        data = application.update(**request.data)
        return JsonResponse(success_code(data))


class AvailableAwardsView(APIView):

    def get(self, request):
        """获取可申请的奖项（所属部门的）"""
        now = timezone.now()

        def get_queryset_by_status(status, valid_awards: QuerySet):
            award_status = {
                "1": valid_awards.filter(Q(start_time__gt=now)),
                "2": valid_awards.filter(Q(start_time__lt=now) & Q(end_time__gt=now)),
                "3": valid_awards.filter(Q(end_time__lt=now)),
                "4": valid_awards.filter(approval_state=1),
            }
            return award_status[status].order_by('-create_time')
        department_id = request.query_params.get("group_id")
        if department_id:
            valid_awards = Awards.objects.filter(award_department_id=department_id)
        else:
            departments_id = GroupUser.objects.filter(username=request.user.username).values_list("group_id")
            departments_id = [item[0] for item in departments_id]
            valid_awards = Awards.objects.filter(award_department_id__in=departments_id)
        valid_awards = get_queryset_by_status(request.query_params.get("award_status"), valid_awards)
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
        record = AwardApplicationRecord.objects.filter(Q(approval_state=RecordStatus["pass"]) & Q(
            application_users__contains={"username": request.user.username}))\
            .order_by('-application_time')
        pagination = PagePagination()
        try:
            pager_roles = pagination.paginate_queryset(queryset=record, request=request, view=self)
            ser = AwardsRecordSerializers(instance=pager_roles, many=True)
            return JsonResponse(success_code(pagination.get_paginated_response(ser.data)))
        except EmptyPage:
            return JsonResponse(page_num_exception())
        except BaseException:
            return JsonResponse(value_exception())


@api_view(["GET"])
def get_award_by_id(request, id):
    award = Awards.objects.filter(pk=id).first()
    return JsonResponse(success_code(model_to_dict(award) if award else None))


@api_view(["GET"])
def get_application_by_id(request, id):
    application = AwardApplicationRecord.objects.filter(pk=id).first()
    return JsonResponse(success_code(model_to_dict(application) if application else None))


@api_view(["POST"])
def finish_award(request, id):
    award = Awards.objects.filter(pk=id).first()
    if award:
        with transaction.atomic():
            award.approval_state = AwardsStatus["end"]
            award.save()
            AwardApplicationRecord.objects.filter(award_id=award.id).update(
                approval_state=ApprovalState.review_not_passed.value[0])
        return JsonResponse(success_code(None))
    else :
        return JsonResponse(object_not_exist_error("奖项"))


@api_view(["GET"])
def award_application(request, id):
    applications = AwardApplicationRecord.objects.filter(award_id=id)
    serializers = AwardsRecordSerializers(applications, many=True)
    return JsonResponse(success_code(serializers.data))
