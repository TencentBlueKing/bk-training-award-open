<template>
    <self-table :data="pendingApprovalData"
        :pagination.sync="pagination"
        :loading="loading"
        @page-change="handleInit()"
    >
        <bk-table-column type="index" label="序号" width="60"></bk-table-column>
        <bk-table-column label="奖项名称" prop="ip"></bk-table-column>
        <bk-table-column label="申请开始时间" prop="source"></bk-table-column>
        <bk-table-column label="申请截止时间" prop="status"></bk-table-column>
        <bk-table-column label="申请人" prop="create_time"></bk-table-column>
        <bk-table-column label="奖项顾问" prop="create_time"></bk-table-column>
        <bk-table-column label="操作">
            <template slot-scope="approvals">
                <bk-button class="mr10" theme="primary" :text="true" @click="handleToGetDetail(approvals.row)"> 查看 </bk-button>
                <bk-button class="mr10 ml10" theme="success" :text="true" @click="handleToRefundApplication(approvals.row)">前往审批</bk-button>
            </template>
        </bk-table-column>
    </self-table>
</template>

<script>
    import { tableMixins } from '@/views/mycheck/table/tableMixins'
    import { getAwardApproval } from '@/api/service/apply-service'

    export default {
        name: 'award-pending-approval',
        mixins: [tableMixins],
        data () {
            return {
                pendingApprovalRemoteData: [
                    
                ]
            }
        },
        computed: {
            pendingApprovalData (self) {
                return self.pendingApprovalRemoteData?.map(item => {
                    return item
                }) ?? []
            }
        },
        mounted () {
            this.handleInit()
        },
        methods: {
            handleInit () {
                Promise.all(
                    [this.handleGetPendingApproval()]
                )
            },
            handleGetPendingApproval (page = this.pagination.current, size = this.pagination.limit) {
                if (this.loading) return
                this.loading = true
                const params = {
                    page,
                    size,
                    group_id: this.$bus.curGlobalGroupId,
                    approval_status: 1
                }
                return getAwardApproval(params).then(response => {
                    const approvals = response.data
                    this.pagination.count = approvals.count
                    this.pendingApprovalRemoteData = approvals.results
                }).finally(_ => {
                    this.loading = false
                })
            },
            handleToGetDetail () {},
            handleToRefundApplication () {

            },
            handleToEditDraft () {}
        }
    }
</script>handleGetPendingApproval() page=this.pag{
}
,
