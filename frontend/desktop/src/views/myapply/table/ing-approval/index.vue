<template>
    <self-table :data="ingApprovalData" :loading="loading">
        <bk-table-column type="index" label="序号" width="60"></bk-table-column>
        <bk-table-column label="奖项名称" prop="ip"></bk-table-column>
        <bk-table-column label="奖项开始时间" prop="source"></bk-table-column>
        <bk-table-column label="奖项截止时间" prop="status"></bk-table-column>
        <bk-table-column label="奖项咨询人" prop="create_time"></bk-table-column>
        <bk-table-column label="当前评审人" width="400px">
            <template slot-scope="ingApprovals">
                <select-search
                    v-for="item in ingApprovals.row['award_reviewers']"
                    :key="item"
                    type="self"
                    :data="item"
                    :id-key="'username'"
                    :display-key="'username'"
                    :value="ingApprovals.row['award_reviewers'][0]"
                ></select-search>
            </template>
        </bk-table-column>
        <bk-table-column label="操作">
            <template slot-scope="ingApprovals">
                <bk-button @click="handleToGetDetail(ingApprovals.row)" :text="true">  查看 </bk-button>
            </template>
        </bk-table-column>
    </self-table>
</template>

<script>
    export default {
        name: 'ing-approval',
        data () {
            return {
                ingApprovalRemoteData: [{
                    'id': 1,
                    'award_name': '奖项名称',
                    'award_description': '奖项名称',
                    'award_department_id': 1,
                    'award_department_fullname': '西华大学',
                    'award_reviewers': [[
                        {
                            'username': '3234853521Q',
                            'display_name': '陈润'
                        }
                    ]],
                    'award_consultant': '3234853521Q',
                    'award_consultant_displayname': '3234853521Q（陈润）',
                    'award_demand': '奖项名称',
                    'start_time': '2022-03-19T12:00:00',
                    'end_time': '2022-04-30T11:59:00',
                    'approval_state': 0,
                    'time_range': '2022-03-19 12:00~2022-04-30 11:59'
                }],
                loading: false
            }
        },
        computed: {
            ingApprovalData (self) {
                return self.ingApprovalRemoteData
            }
        },
        mounted () {
            this.handleInit()
        },
        methods: {
            handleInit () {
                console.log('getData')
            },
            handleToGetDetail () {}
        }

    }
</script>
