"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community
Edition) available.
Copyright (C) 2017-2021 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.
"""
from django.db import models

from bk_award.awards.constants import ApplicationStatus, AwardStatus, Quarter, StageStatus
from bk_award.common.model import TimestampedModelMixin, UuidModel


class Award(UuidModel, TimestampedModelMixin):
    """奖项"""

    name = models.CharField("奖项名称", max_length=128)
    description = models.TextField("奖项描述")
    year = models.IntegerField("年份", default=0)
    quarter = models.IntegerField("季度", choices=Quarter.get_choices())

    status = models.CharField("状态", max_length=32, choices=AwardStatus.get_choices())
    started_at = models.DateTimeField("开始时间")
    ended_at = models.DateTimeField("截止时间")

    liaisons = models.JSONField("联系人列表", default=list)
    orgs = models.JSONField("关联组织 ID 列表", default=list)

    policy = models.ForeignKey("policies.Policy", verbose_name="奖项策略", on_delete=models.CASCADE, related_name="awards")


class Application(UuidModel, TimestampedModelMixin):
    """申报"""

    award = models.ForeignKey(Award, verbose_name="奖项", on_delete=models.CASCADE, related_name="applications")

    applicants = models.JSONField("申请人or团队列表", default=list)
    status = models.CharField("状态", max_length=32, choices=ApplicationStatus.get_choices())
    liaisons = models.JSONField("申报接口人列表", default=list)
    staffs = models.JSONField("项目成员", default=list)
    details = models.JSONField("申报详情", default=dict)


class Stage(UuidModel, TimestampedModelMixin):
    """奖项阶段策略"""

    application = models.ForeignKey(Application, verbose_name="策略", on_delete=models.CASCADE, related_name="stages")
    name = models.CharField("名称", max_length=128)
    status = models.CharField("状态", max_length=32, choices=StageStatus.get_choices(), default=StageStatus.PENDING)
    started_at = models.DateTimeField("开始时间")
    ended_at = models.DateTimeField("截止时间")


class Step(UuidModel, TimestampedModelMixin):
    """奖项阶段步骤"""

    stage = models.ForeignKey(Stage, verbose_name="阶段", on_delete=models.CASCADE, related_name="steps")
    type = models.CharField("类型", max_length=32)
    # 当前将不同类型的步骤字段放入 JSON，以便后续扩展
    details = models.JSONField("详情")
    status = models.CharField("状态", max_length=32, choices=StageStatus.get_choices(), default=StageStatus.PENDING)
    started_at = models.DateTimeField("开始时间")
    ended_at = models.DateTimeField("截止时间")
