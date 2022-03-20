<template>
    <self-table :data="endedApprovalData" :loading="loading">
        <bk-table-column type="index" label="序号" width="60"></bk-table-column>
        <bk-table-column label="申请人" prop="ip"></bk-table-column>
        <bk-table-column label="申请时间" prop="source"></bk-table-column>
        <bk-table-column label="审批时间" prop="status"></bk-table-column>
    </self-table>
</template>

<script>
    import { GROUP_ENDED_APPROVAL } from '@/constants'
    import { getGroupApproval } from '@/api/service/group-service'

    export default {
        name: 'group-ended-approval',
        data () {
            return {
                endedApprovalRemoteData: [{}],
                loading: false
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
                Promise.all([
                    this.handleGetGroupEndedApproval()
                ])
            },
            handleGetGroupEndedApproval (page = this.pagination.curren, size = this.pagination.limit) {
                if (this.loading) return
                this.loading = true
                const params = {
                    page,
                    size,
                    group_id: this.$bus.curGlobalGroupId,
                    approval_state: GROUP_ENDED_APPROVAL
                }
                return getGroupApproval(params).then(response => {
                    const groupApprovals = response.data
                    console.log(groupApprovals)
                }).finally(_ => {
                    this.loading = false
                })
            },

            handleGetDetail () {
            }

        }

    }
</script>
