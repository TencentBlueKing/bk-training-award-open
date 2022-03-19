<template>
    <self-table :data="pendingApprovalData">
        <bk-table-column type="index" label="序号" width="60"></bk-table-column>
        <bk-table-column label="奖项名称" prop="ip"></bk-table-column>
        <bk-table-column label="奖项开始时间" prop="source"></bk-table-column>
        <bk-table-column label="奖项截止时间" prop="status"></bk-table-column>
        <bk-table-column label="申请人" prop="create_time"></bk-table-column>
        <bk-table-column label="奖项咨询人" prop="create_time"></bk-table-column>
        <bk-table-column label="操作">
            <template slot-scope="approvals">
                <bk-button class="mr10" theme="primary" :text="true" @click="handleToGetDetail(approvals.row)"> 查看 </bk-button>
                <bk-button class="mr10 ml10" theme="success" :text="true" @click="handleToRefundApplication(approvals.row)">前往审批</bk-button>
            </template>
        </bk-table-column>
    </self-table>
</template>

<script>
    export default {
        name: 'award-pending-approval',
        data () {
            return {
                pendingApprovalRemoteData: [{}]
            }
        },
        computed: {
            pendingApprovalData (self) {
                return self.pendingApprovalRemoteData
            }
        },
        mounted () {
            this.handleInit()
        },
        methods: {
            handleInit () {},
            handleToGetDetail () {},
            handleToRefundApplication () {

            },
            handleToEditDraft () {}
        }
    }
</script>
