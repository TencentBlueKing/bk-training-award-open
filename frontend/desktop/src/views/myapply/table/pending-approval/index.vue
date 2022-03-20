<template>
    <self-table :data="pendingApprovalData"
        :loading="loading"
        :pagination.sync="pagination"
        @page-change="handleInit()"
    >
        <bk-table-column type="index" label="序号" width="60"></bk-table-column>
        <bk-table-column label="奖项名称" prop="ip"></bk-table-column>
        <bk-table-column label="奖项开始时间" prop="source"></bk-table-column>
        <bk-table-column label="奖项截止时间" prop="status"></bk-table-column>
        <bk-table-column label="奖项咨询人" prop="create_time"></bk-table-column>
        <bk-table-column label="操作">
            <template slot-scope="approvals">
                <bk-button class="mr10" theme="primary" :text="true" @click="handleToGetDetail(approvals.row)"> 查看 </bk-button>
                <bk-button class="ml10 mr10" theme="danger" :text="true" @click="handleToRefundApplication(approvals.row)">撤回申请</bk-button>
                <bk-button class="ml10 mr10" theme="warning" :text="true" @click="handleToEditDraft(approvals.row)">编辑草稿</bk-button>
            </template>
        </bk-table-column>
    </self-table>
</template>

<script>
    import { DETAIL_ROUTE_PATH, PENDING_APPROVAL } from '@/constants'
    import { getRecord } from '@/api/service/apply-service'
    import { applyTableMixins } from '@/views/myapply/table/mixins'

    export default {
        name: 'pending-approval',
        mixins: [applyTableMixins],
        data () {
            return {
                pendingApprovalRemoteData: []
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
            handleInit () {
                Promise.all([
                    this.handleGetPendingApproval()
                ])
            },
            handleGetPendingApproval (page = this.pagination.current, size = this.pagination.limit) {
                const params = {
                    page,
                    size,
                    group_id: this.$bus.curGlobalGroupId,
                    apply_status: PENDING_APPROVAL
                }
                if (this.loading) return
                this.loading = true
                return getRecord(params).then(response => {
                    console.log(response)
                    const applications = response.data
                    this.pagination['count'] = applications.count
                    this.pendingApprovalRemoteData = applications.data
                }).finally(_ => {
                    this.loading = false
                })
            },
            handleToRefundApplication () {},
            handleToEditDraft (recordInfo) {
                if (!recordInfo['award_id']) {
                    return
                }
                this.$router.push({
                    name: DETAIL_ROUTE_PATH,
                    query: {
                        type: 'edit',
                        award_id: recordInfo['award_id'],
                        record_id: recordInfo['record_id']
                    }
                })
            },
            handleToGetDetail (recordInfo) {
                this.$router.push({
                    name: DETAIL_ROUTE_PATH,
                    query: {
                        type: 'detail',
                        award_id: recordInfo['award_id'],
                        record_id: recordInfo['record_id']
                    }
                })
            }
        }
    }
</script>
