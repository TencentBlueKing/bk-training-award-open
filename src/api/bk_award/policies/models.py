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

from bk_award.common.model import UuidModel


class Level(models.Model):
    """奖项级别"""

    name = models.CharField("名称", max_length=32, unique=True)
    sort = models.IntegerField(unique=True)


class Policy(UuidModel):
    """奖项策略"""

    name = models.CharField("名称", max_length=128)
    description = models.TextField("描述", default="")
    level = models.ForeignKey(Level, verbose_name="奖项级别", on_delete=models.CASCADE)
    liaisons = models.JSONField("联系人列表", default=list)
    # Q: 为什么使用 JSON 字段，而不是对其中的字段进行建模？
    # A: 考虑到项目初期，很多字段无法固定，使用 JSON 内存对象解析能够提供灵活度，后续需求沉淀后，可以转换为 DB 字段
    stages = models.JSONField("阶段策略列表", default=list)
