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
from blue_krill.web.drf_utils import inject_serializer
from django.db.transaction import atomic
from rest_framework import viewsets

from bk_award.awards import serializers
from bk_award.awards.models import Policy


class PolicyViewSet(viewsets.ViewSet):
    """策略 API"""

    @atomic
    @inject_serializer(body_in=serializers.CreatePolicySLZ, out=serializers.PolicySLZ)
    def create(self, validated_data: dict):
        """创建申报应用"""
        policy = Policy.objects.create(**validated_data)
        return policy
