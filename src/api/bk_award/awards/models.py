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
from bk_award.awards.managers import StageGenerator, StepGenerator
from bk_award.common.model import TimestampedModelMixin, UuidModel


class Level(models.Model):
    """奖项级别"""

    name = models.CharField("名称", max_length=32, unique=True)
    sort = models.IntegerField(unique=True)

    class Meta:  # type: ignore
        db_table = "award_level"


class Policy(UuidModel):
    """奖项策略"""

    name = models.CharField("名称", max_length=128)
    description = models.TextField("描述", default="")
    level = models.ForeignKey(Level, verbose_name="奖项级别", on_delete=models.CASCADE)
    liaisons = models.JSONField("联系人列表", default=list)
    # Q: 为什么使用 JSON 字段，而不是对其中的字段进行建模？
    # A: 考虑到项目初期，很多字段无法固定，使用 JSON 内存对象解析能够提供灵活度，后续需求沉淀后，可以转换为 DB 字段
    stages = models.JSONField("阶段策略列表", default=list)

    class Meta:  # type: ignore
        db_table = "award_policy"


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

    policy = models.ForeignKey(Policy, verbose_name="奖项策略", on_delete=models.CASCADE, related_name="awards")

    class Meta:
        db_table = "award_award"


class Application(UuidModel, TimestampedModelMixin):
    """申报"""

    award = models.ForeignKey(Award, verbose_name="奖项", on_delete=models.CASCADE, related_name="applications")

    applicants = models.JSONField("申请人或团队列表", default=list)
    status = models.CharField(
        "状态", max_length=32, choices=ApplicationStatus.get_choices(), default=ApplicationStatus.STARTED
    )
    liaisons = models.JSONField("申报接口人列表", default=list)
    staffs = models.JSONField("项目成员", default=list)
    details = models.JSONField("申报详情", default=dict)

    class Meta:
        db_table = "award_application"

    def generate_stages(self):
        """生成各申报阶段"""
        for stage, policy in Stage.generator.generate(self):
            Step.generator.generate(stage, policy["steps"])


class Stage(UuidModel, TimestampedModelMixin):
    """奖项阶段"""

    application = models.ForeignKey(Application, verbose_name="申请", on_delete=models.CASCADE, related_name="stages")

    name = models.CharField("名称", max_length=128)
    status = models.CharField("状态", max_length=32, choices=StageStatus.get_choices(), default=StageStatus.PENDING)
    details = models.JSONField("阶段详情", default=dict)
    started_at = models.DateTimeField("开始时间")
    ended_at = models.DateTimeField("截止时间")

    generator = StageGenerator()

    class Meta:
        db_table = "award_stage"


class Step(UuidModel, TimestampedModelMixin):
    """奖项阶段步骤"""

    name = models.CharField("名称", max_length=128)
    stage = models.ForeignKey(Stage, verbose_name="阶段", on_delete=models.CASCADE, related_name="steps")

    type = models.CharField("类型", max_length=32)
    # 当前将不同类型的步骤字段放入 JSON，以便后续扩展
    details = models.JSONField("详情")
    status = models.CharField("状态", max_length=32, choices=StageStatus.get_choices(), default=StageStatus.PENDING)
    started_at = models.DateTimeField("开始时间")
    ended_at = models.DateTimeField("截止时间")

    generator = StepGenerator()

    class Meta:
        db_table = "award_step"
