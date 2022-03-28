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
from typing import TYPE_CHECKING, Generator, List, Tuple

from django.db import models

from bk_award.awards.parsers import parse_policy

if TYPE_CHECKING:
    from bk_award.awards.models import Application, Stage, Step


class StepGenerator(models.Manager):
    """步骤生成器"""

    def generate(self, stage: "Stage", step_policies: List[dict]) -> Generator["Step", None, None]:
        """通过 Stage 信息生成步骤"""

        def generate_step_params(_stage: "Stage", _policy: dict) -> dict:
            """生成步骤参数"""
            return parse_policy(_policy).to_dict()

        for policy in step_policies:
            step, _ = self.get_or_create(stage=stage, **generate_step_params(stage, policy))
            yield step


class StageGenerator(models.Manager):
    """阶段生成器"""

    def generate(self, application: "Application") -> Generator[Tuple["Stage", dict], None, None]:
        """通过 Application 信息生成阶段"""

        def generate_stage_params(_application: "Application", _policy: dict) -> dict:
            """生成阶段参数"""
            return {"name": _policy["name"]}

        for policy in application.award.policy.stages:
            stage, _ = self.get_or_create(application=application, **generate_stage_params(application, policy))
            yield stage, policy
