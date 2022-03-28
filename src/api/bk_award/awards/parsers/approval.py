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
class Approval(StepParserBase):
    """审批步骤解析器"""

    type: ClassVar[str] = "approval"
    approvers: List[str] = field(default_factory=list)

    @dataclass
    class Policy:
        approver_roles: List[str]

    @classmethod
    def generate_by_policy(cls, policy_data: dict) -> "Approval":
        _ = policy_data.pop("type")
        name = policy_data.pop("name")
        policy = cls.Policy(**policy_data)
        step = cls(name=name)
        step.load_approvers_by_roles(policy.approver_roles)
        return step

    @classmethod
    def load_from_db(cls, data: dict) -> "Approval":
        return cls(**data)

    def load_approvers_by_roles(self, roles: List[str]):
        """通过角色获取审批人"""
        for role in roles:
            # TODO: implement
            self.approvers.append("fake_" + role)


register_parser(Approval)
