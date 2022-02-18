from django.db import models
from django_mysql.models import JSONField
from enum import Enum


# Create your models here.
class Awards(models.Model):
    id = models.AutoField(primary_key=True)
    award_name = models.CharField(max_length=128, verbose_name="奖项名称")
    award_level = models.CharField(max_length=128, verbose_name="奖项级别")
    award_description = models.CharField(max_length=512, verbose_name="奖项描述")
    award_department_fullname = models.CharField(
        max_length=50, verbose_name="奖项所属部门full_name"
    )
    award_reviewers = JSONField(verbose_name="奖项评委", default=list)
    award_consultant = models.CharField(max_length=128, verbose_name="奖项顾问")
    award_image = models.ImageField(max_length=1000, upload_to="img")
    create_time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    update_time = models.DateTimeField(auto_now=True, verbose_name="更新时间")
    start_time = models.DateTimeField(verbose_name="开始申请时间")
    end_time = models.DateTimeField(verbose_name="截止申请时间")
    APPROVAL_STATE = [
        (0, "未开始"),
        (1, "已开始"),
        (2, "已结束"),
    ]
    approval_state = models.IntegerField(
        choices=APPROVAL_STATE, default=3, verbose_name="评审状态"
    )


class Secretary(models.Model):
    group_id = models.IntegerField(verbose_name="组id", unique=True)
    secretaries = JSONField(verbose_name="组内秘书", default=list)
    group_full_name = models.CharField(max_length=50, verbose_name="组full_name")


# 管理员表
class Admin(models.Model):
    admin_username = models.CharField(max_length=50, verbose_name="管理员")


# 申请表approval_state choices
class ApprovalState(Enum):
    review_pending = 0, "待评审"
    review_passed = 1, "评审通过"
    review_not_passed = 2, "评审不通过"
    draft = 3, "草稿"


# 申请表
class AwardApplicationRecord(models.Model):
    id = models.AutoField(primary_key=True)
    award_id = models.IntegerField(verbose_name="奖项id")
    application_time = models.DateTimeField(verbose_name="申请时间")
    application_reason = models.TextField(verbose_name="申请理由")
    application_users = JSONField(verbose_name="申请人username列表", default=list)
    application_attachments = JSONField(verbose_name="申请附件地址列表", default=list)
    approval_state = models.IntegerField(
        choices=[item.value for item in ApprovalState], default=3, verbose_name="评审状态"
    )
    approval_users = JSONField(verbose_name="评审人map", null=True)
    approval_turn = models.IntegerField(verbose_name="评审轮次", default=0)
    approval_time = models.DateTimeField(verbose_name="评审时间", null=True)
    approval_text = models.TextField(verbose_name="评审评语", null=True)
