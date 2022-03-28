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
from dataclasses import dataclass, field
from typing import ClassVar, List

from bk_award.awards.parsers import StepParserBase, register_parser


@dataclass
class Notification(StepParserBase):
    """通知步骤解析器"""

    type: ClassVar[str] = "notification"
    receivers: List[str] = field(default_factory=list)
    methods: List[str] = field(default_factory=list)
    content_tmpl: dict = field(default_factory=dict)

    @dataclass
    class Policy:
        methods: List[str] = field(default_factory=list)
        receiver_roles: List[str] = field(default_factory=list)

    @classmethod
    def generate_by_policy(cls, policy_data: dict) -> "StepParserBase":
        return cls(name=policy_data["name"], methods=policy_data["methods"])


register_parser(Notification)
