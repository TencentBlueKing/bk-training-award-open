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
from blue_krill.data_types.enum import EnumField, StructuredEnum


class Quarter(StructuredEnum):
    """季度"""

    Q1 = 1
    Q2 = 2
    Q3 = 3
    Q4 = 4


class AwardStatus(StructuredEnum):
    """奖项状态"""

    PENDING = EnumField("pending", label="未开始")
    STARTED = EnumField("started", label="可申报")
    EXPIRED = EnumField("expired", label="已过期")


class ApplicationStatus(StructuredEnum):
    """申报状态"""

    STARTED = EnumField("started", label="申报中")
    FAILED = EnumField("failed", label="未获奖")
    SUCCEED = EnumField("succeed", label="已获奖")


class StageStatus(StructuredEnum):
    """阶段 or 步骤状态"""

    PENDING = EnumField("pending", label="未开始")
    STARTED = EnumField("started", label="进行中")
    FINISHED = EnumField("finished", label="完成")
    ABORTED = EnumField("aborted", label="中止")
