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
from dataclasses import asdict, dataclass
from typing import ClassVar, Type


@dataclass
class StepParserBase:
    """步骤解析基类"""

    type: ClassVar[str]
    name: str

    @classmethod
    def generate_by_policy(cls, policy_data: dict) -> "StepParserBase":
        raise NotImplementedError

    def to_dict(self) -> dict:
        return asdict(self)


_parsers = {}


def register_parser(parser: Type[StepParserBase]):
    """注册步骤解析器"""
    _parsers[parser.type] = parser


def get_parser(type_: str) -> Type[StepParserBase]:
    """加载所有的步骤解析器"""
    return _parsers[type_]


def parse_policy(policy_data: dict) -> StepParserBase:
    """解析策略"""
    return get_parser(policy_data["type"]).generate_by_policy(policy_data=policy_data)
