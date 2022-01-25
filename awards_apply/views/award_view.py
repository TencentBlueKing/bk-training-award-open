import json
from itertools import chain
from django.db.models import Q
from django.http import JsonResponse
from django.shortcuts import render
from django.utils import timezone
# Create your views here.
from django.views.decorators.http import require_http_methods
from rest_framework.views import APIView

from awards_apply.tools.const import false_code,success_code,object_not_exist_error
from awards_apply.serializers.award_serializers import AwardsSerializers, AwardsRecordSerializers
from awards_apply.models import Awards, AwardApplicationRecord
from awards_apply.tools.my_pagination import MyPageNumberPagination

# 奖项的状态
AwardsStatus = {'未开始': 0, '已开始': 1, '已结束': 2}
# 奖项申请的状态
RecordStatus = {'待评审': 0, '评审通过': 1, '评审不通过': 2, '草稿': 3}


def home(request):
    """
    首页
    """
    return render(request, "index.html")


class AwardView(APIView):

    def get(self, request, *args, **kwargs):
        request_user = request.user.username
        now = timezone.now()
        # ids表示：当前用户申请过的所有申请记录（包括草稿和正式申请）中的所有奖项id列表
        ids = AwardApplicationRecord.objects.filter(application_users__contain=request_user).values_list("award_id")
        # valid_awards表示：符合规定时间内的，用户没申请过的奖项
        valid_awards = Awards.objects.exclude(id__in=ids).filter(start_time__lt=now).filter(end_time__gt=now)
        # 自定义我的分页器
        pg = MyPageNumberPagination()
        try:
            pager_roles = pg.paginate_queryset(queryset=valid_awards, request=request, view=self)
            ser = AwardsSerializers(instance=pager_roles, many=True)
            return pg.get_paginated_response(ser.data)
        except Exception:
            return JsonResponse(false_code("页码超出范围"))


@require_http_methods(["POST"])
def make_an_application(request):
    """保存草稿和正式申请"""
    # 校验请求参数
    award_record = AwardsRecordSerializers(data=json.loads(request.body))
    if award_record.is_valid() is False:
        return JsonResponse(false_code(award_record.errors))
    record = award_record.validated_data
    # 查询申请记录表中：指定奖项且正在申请的用户list,得到的结果是个二维数组。
    apply_list = AwardApplicationRecord.objects.filter(award_id=record["award_id"]). \
        filter(~Q(approval_state=RecordStatus['草稿'])).values_list("application_users")
    # 数组扁平化
    had_applied_users = sum(list(chain.from_iterable(apply_list)), [])
    # 查询两个数组有没有共同的申请者
    same_person = [x for x in record["application_users"] if x in had_applied_users]
    # 如果有，则返回警告，保存失败
    if len(same_person):
        return JsonResponse(false_code("指定用户已申请过该奖项"))
    # 否则，保存记录
    award_record.save()
    return JsonResponse(success_code({}))


@require_http_methods(["GET"])
def withdraw_an_application(request):
    """撤回申请"""
    award_apply_record_id = json.loads(request.body).get("id")
    # 参数校验
    try:
        award_apply_record_id = int(award_apply_record_id)
        record = AwardApplicationRecord.objects.get(id=award_apply_record_id)
        # 设为草稿
        record.approval_state = RecordStatus['草稿']
        record.save()
    except TypeError:
        return JsonResponse(false_code("未传参数"))
    except ValueError:
        return JsonResponse(false_code("参数类型错误"))
    except AwardApplicationRecord.DoesNotExist:
        return JsonResponse(object_not_exist_error("AwardApplicationRecord"))
    return JsonResponse(success_code({}))


def upload_img(request, award_id):
    """上传图片"""
    image = request.FILES['upload_file']
    try:
        award_id = int(award_id)
        award = Awards.objects.get(id=award_id)
        award.award_image = image
        award.save()
    except ValueError:
        return JsonResponse(false_code("参数类型错误"))
    except Awards.DoesNotExist:
        return JsonResponse(object_not_exist_error("Award"))
    return JsonResponse(success_code({}))


@require_http_methods(["POST"])
def create_award(request):
    """创建奖项"""
    # 参数校验
    award = AwardsSerializers(data=json.loads(request.body))
    if award.is_valid():
        award.save()
        return JsonResponse(success_code(award.data))
    return JsonResponse(false_code(award.errors))
