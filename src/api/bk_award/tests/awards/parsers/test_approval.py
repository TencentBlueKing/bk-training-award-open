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
import pytest

from bk_award.awards.parsers import parse_policy


class TestApproval:
    @pytest.mark.parametrize(
        "samples,expected",
        [
            (
                {"type": "approval", "name": "评选资格审批", "approver_roles": ["group_manager"]},
                {"name": "评选资格审批", "approvers": ["fake_group_manager"]},
            ),
            (
                {"type": "notification", "name": "通知审批资格", "receiver_roles": ["group_manager"], "methods": ["email"]},
                {"name": "通知审批资格", "receivers": [], "methods": ["email"], "content_tmpl": {}},
            ),
        ],
    )
    def test_generate_by_policy(self, samples, expected):
        """测试生成审批步骤"""
        assert parse_policy(samples).to_dict() == expected
