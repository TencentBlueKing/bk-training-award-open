# -*- coding: utf-8 -*-
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

# from django.db import models

# Create your models here.
from django.db import models
from django_jsonfield_backport import models as json_models


# 申请表
class AwardApplicationRecord(models.Model):
    award_id = models.IntegerField(verbose_name="奖项id")
    application_time = models.DateTimeField(verbose_name="申请时间")
    application_reason = models.TextField(verbose_name="申请理由")
    application_id = json_models.JSONField(verbose_name="申请人id列表")
    application_attachments = json_models.JSONField(verbose_name="申请附件地址列表")
    APPROVAL_STATE = [
        (0, "待评审"),
        (1, "评审通过"),
        (2, "评审不通过"),
        (3, "草稿"),
    ]
    approval_state = models.IntegerField(choices=APPROVAL_STATE, default=3, verbose_name="评审状态")
    approval_id = models.IntegerField(verbose_name="评审人id", null=True)
    approval_time = models.DateTimeField(verbose_name="评审时间", null=True)
    approval_text = models.TextField(verbose_name="评审评语", null=True)