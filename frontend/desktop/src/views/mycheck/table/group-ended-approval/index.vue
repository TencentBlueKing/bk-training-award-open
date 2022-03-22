<template>
    <self-table :data="endedApprovalData" :loading="loading">
        <bk-table-column type="index" label="序号" width="60"></bk-table-column>
        <bk-table-column label="申请人" prop="display_name_for_display"></bk-table-column>
        <bk-table-column label="申请时间" prop="create_time"></bk-table-column>
        <bk-table-column label="审批时间" prop="update_time"></bk-table-column>
    </self-table>
</template>

<script>
    import { GROUP_ENDED_APPROVAL } from '@/constants'
    import { getGroupManage } from '@/api/service/group-service'
    import { tableMixins } from '@/views/mycheck/table/tableMixins'
    import { formatUsernameAndDisplayName } from '@/common/util'

    export default {
        name: 'group-ended-approval',
        mixins: [tableMixins],
        data () {
            return {
                endedApprovalRemoteData: [{}],
                loading: false
            }
        },
        computed: {
            endedApprovalData (self) {
                return self.endedApprovalRemoteData.map(item => {
                    return {
                        apply_id: item['apply_id'],
                        group_id: item['group_id'],
                        group_name: item['group_name'],
                        username: item['username'],
                        display_name: item['display_name'],
                        display_name_for_display: formatUsernameAndDisplayName(item['username'], item['display_name']),
                        status: item['status'],
                        create_time: item['create_time'],
                        update_time: item['update_time']
                    }
                })
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
                    group_id: this.$bus.curGlobalGroupId,
                    approval_state: GROUP_ENDED_APPROVAL
                }
                return getGroupManage(params).then(response => {
                    this.endedApprovalRemoteData = response.data
                }).finally(_ => {
                    this.loading = false
                })
            },

            handleGetDetail () {
            }

        }

    }
</script>
