<template>
    <self-table :data="endedApprovalData"
        :loading="loading"
        :pagination.sync="pagination"
        @page-change="handleInit()"
    >
        <bk-table-column type="index" label="序号" width="60"></bk-table-column>
        <bk-table-column label="奖项名称" prop="ip"></bk-table-column>
        <bk-table-column label="申请开始时间" prop="source"></bk-table-column>
        <bk-table-column label="申请截止时间" prop="status"></bk-table-column>
        <bk-table-column label="奖项顾问" prop="create_time"></bk-table-column>
        <bk-table-column label="评语">
            <template slot-scope="endedApprovals">
                <bk-select :readonly="true">
                    <bk-option>{{endedApprovals.row}}</bk-option>
                </bk-select>
            </template>
        </bk-table-column>
        <bk-table-column label="操作">
            <template slot-scope="endedApprovals">
                <bk-button @click="handleGetDetail(endedApprovals.row)" :text="true"></bk-button>
            </template>
        </bk-table-column>
    </self-table>
</template>

<script>
    import { getAwardApproval } from '@/api/service/apply-service'
    import { tableMixins } from '@/views/mycheck/table/tableMixins'
    export default {
        name: 'award-ended-approval',
        mixins: [tableMixins],
        data () {
            return {
                endedApprovalRemoteData: [{}]
            }
        },
        computed: {
            endedApprovalData (self) {
                return self.endedApprovalRemoteData
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
                    approval_status: 2
                }
                return getAwardApproval(params).then(response => {
                    const approvals = response.data
                    this.pagination.count = approvals.count
                    this.endedApprovalRemoteData = approvals.results
                }).finally(_ => {
                    this.loading = false
                })
            },
            handleGetDetail () {

            }

        }

    }
</script>
