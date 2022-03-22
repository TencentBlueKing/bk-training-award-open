<template>
    <self-table :data="endedApprovalData"
        :loading="loading"
        :pagination.sync="pagination"
        @page-change="handleInit()"
    >
        <bk-table-column type="index" label="序号" width="60"></bk-table-column>
        <bk-table-column label="奖项名称" prop="ip"></bk-table-column>
        <bk-table-column label="奖项开始时间" prop="source"></bk-table-column>
        <bk-table-column label="奖项截止时间" prop="status"></bk-table-column>
        <bk-table-column label="奖项咨询人" prop="create_time"></bk-table-column>
        <bk-table-column label="评语" :width="300">
            <template slot-scope="endedApprovals">
                <span v-bk-tooltips.light="endedApprovals.row['approval_text']"
                >{{endedApprovals.row['approval_text']}}</span>
            </template>
        </bk-table-column>
    </self-table>
</template>

<script>
    import { DETAIL_ROUTE_PATH, ENDED_APPROVAL } from '@/constants'
    import { getRecord } from '@/api/service/apply-service'
    import { applyTableMixins } from '@/views/myapply/table/mixins'

    export default {
        name: 'ended-approval',
        mixins: [applyTableMixins],
        data () {
            return {
                endedApprovalRemoteData: []
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
                    [this.handleGetEndedApproval()]
                )
            },
            handleGetEndedApproval (page = this.pagination.current, size = this.pagination.limit) {
                const params = {
                    page,
                    size,
                    group_id: this.$bus.curGlobalGroupId,
                    apply_status: ENDED_APPROVAL
                }
                if (this.loading) return
                this.loading = true
                return getRecord(params).then(response => {
                    const applications = response.data
                    this.pagination['count'] = applications.count
                    this.endedApprovalRemoteData = applications.data
                }).finally(_ => {
                    this.loading = false
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
