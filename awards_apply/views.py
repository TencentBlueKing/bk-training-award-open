import math
import time
import json

from django.core.serializers.json import DjangoJSONEncoder
from django.db.models import Q
from django.http import JsonResponse
from django.shortcuts import render
from django.utils import timezone
from django.core import serializers
# Create your views here.
from awards_apply.drf_serializers import AwardsSerializers
from awards_apply.models import Awards, AwardApplicationRecord
from rest_framework.response import Response

def home(request):
    """
    首页
    """
    return render(request, "index.html")


def get_awards_list(request):
    page_num = int(request.GET.get('page_num', 1))
    page_size = int(request.GET.get('page_size', 10))
    request_user = request.user.username
    now = timezone.now()
    valid_awards = Awards.objects.filter(start_time__lt=now).filter(end_time__gt=now).order_by('id')
    total_count = valid_awards.count()
    # 筛选用户没有申请过的奖项
    format_data = []
    for valid_award in valid_awards:
        serializers_data = AwardsSerializers(valid_award).data
        serializers_data_id = serializers_data['id']
        apply_records = AwardApplicationRecord.objects.filter(award_id=serializers_data_id)
        flag = True
        for apply_record in apply_records:
            if request_user in apply_record.application_users:
                flag = False
                break
        if flag:
            format_data.append(serializers_data)
    lens = len(format_data)
    page_count = math.ceil(lens / page_size)
    end = page_num * page_size
    if page_num == page_count:
        end = lens
    elif page_num > page_count or page_num < 1:
        return JsonResponse({
            "code": 1,
            "result": False,
            "message": "页码超出范围",
            "data": {}
        })
    current_data = format_data[(page_num - 1) * page_size:end]
    data = {"awards": current_data, "page_count": page_count, "total_count": total_count}
    return JsonResponse({
        "code": 0,
        "result": True,
        "message": "请求成功",
        "data": data
    })


def deal_with_an_apply(request):
    req = json.loads(request.body)
    operation_code = int(req.get("operation_code", 0))
    award_apply_record_id = int(req.get("award_apply_record_id", -1))
    award_id = int(req.get("award_id", 0))
    application_reason = req.get("application_reason", "")
    now = timezone.now()
    application_time = now
    application_id = req.get("application_users", [])
    application_attachments = req.get("application_attachments", [])
    # 保存草稿
    if operation_code == 0:
        approval_state = 3
        if award_apply_record_id == -1:
            AwardApplicationRecord.objects.create(
                award_id=award_id,
                application_reason=application_reason,
                application_users=application_id,
                application_attachments=application_attachments,
                approval_state=approval_state,
                application_time=application_time
            )
        else:
            record = AwardApplicationRecord.objects.get(id=award_apply_record_id)
            record.application_reason = application_reason
            record.application_id = application_id
            record.application_attachments = application_attachments
            record.save()
        return JsonResponse({
            "code": 0,
            "result": True,
            "message": "已保存为草稿",
            "data": {}
        })
    # 发起申请
    elif operation_code == 1:
        approval_state = 0
        apply_list = []
        try:
            apply_list = AwardApplicationRecord.objects.filter(award_id=award_id).filter(~Q(approval_state=3))
        finally:
            for person_id in application_id:
                for apply_item in apply_list:
                    if person_id in apply_item.application_id:
                        return JsonResponse({
                            "code": 1,
                            "result": False,
                            "message": "指定用户已经申请过该奖项",
                            "data": {}
                        })
            if award_apply_record_id == -1:
                AwardApplicationRecord.objects.create(
                    award_id=award_id,
                    application_reason=application_reason,
                    application_users=application_id,
                    application_attachments=application_attachments,
                    approval_state=approval_state,
                    application_time=application_time
                )
            else:
                award_application_record = AwardApplicationRecord.objects.get(id=award_apply_record_id)
                award_application_record.approval_state = 0
                award_application_record.save()
        return JsonResponse({
            "code": 0,
            "result": True,
            "message": "已发起申请",
            "data": {}
        })
    # 撤销申请
    elif operation_code == 2:
        record = AwardApplicationRecord.objects.get(id=award_apply_record_id)
        record.approval_state = 3
        record.save()
        return JsonResponse({
            "code": 0,
            "result": True,
            "message": "撤销成功",
            "data": {}
        })


def upload_img(request, award_id):
    image = request.FILES['upload_file']
    award_id = int(award_id)
    award = Awards.objects.get(id=award_id)
    award.award_image = image
    award.save()
    return JsonResponse({
        "code": 0,
        "result": True,
        "message": "上传成功",
        "data": {}
    })


def create_award(request):
    req = json.loads(request.body)
    award_name = req.get('award_name','')
    award_level = req.get('award_level','')
    award_description = req.get('award_description','')
    award_department_fullname = req.get('award_department_fullname','')
    award_reviewers = req.get('award_reviewers',[])
    award_consultant = req.get('award_consultant','')
    start_time = req.get('start_time','')
    end_time = req.get('end_time','')
    approval_state = 0
    award = Awards.objects.create(
        award_name=award_name,
        award_level=award_level,
        award_description=award_description,
        award_department_fullname=award_department_fullname,
        award_reviewers=award_reviewers,
        award_consultant=award_consultant,
        start_time=start_time,
        end_time=end_time,
        approval_state=approval_state
    )
    return JsonResponse({
        "code": 0,
        "result": True,
        "message": "创建成功",
        "data": award
    })