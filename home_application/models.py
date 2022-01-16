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

from django.db import models

# Create your models here.
class Awards(models.Model):
    award_name = models.CharField(max_length=128, verbose_name="奖项名称")
    award_level = models.CharField(max_length=128, verbose_name="奖项级别")
    award_description = models.CharField(max_length=512, verbose_name="奖项描述")
    award_consultant = models.CharField(max_length=128, verbose_name="奖项顾问")
    award_image = models.ImageField(max_length=1000, upload_to='img')
    create_time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    update_time = models.DateTimeField(auto_now=True, verbose_name="更新时间")
    start_time = models.DateTimeField(verbose_name="开始申请时间")
    end_time = models.DateTimeField(verbose_name="截止申请时间")
    APPROVAL_STATE = [
        (0, "未开始"),
        (1, "已开始"),
        (2, "已结束"),
    ]
    approval_state = models.IntegerField(choices=APPROVAL_STATE, default=3, verbose_name="评审状态")


class Secretary(models.Model):
    user_id = models.CharField(max_length=128, verbose_name="用户id")
    group_id = models.CharField(max_length=128, verbose_name="组id")