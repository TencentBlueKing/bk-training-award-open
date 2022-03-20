<template>
    <self-table :data="groupApprovalData"
        :pagination.sync="pagination"
        :loading="loading"
        @page-change="handleGetPageData"
    >
        <bk-table-column label="序列" width="60"></bk-table-column>
        <bk-table-column label="申请人"></bk-table-column>
        <bk-table-column label="操作">
            <template slot-scope="groupApprovalRecords">
                <bk-button :text="true" @click="toApprovalGroupJoin(groupApprovalRecords.row)">
                    通过
                </bk-button>
                <bk-button :text="true" @click="toApprovalGroupJoin(groupApprovalRecords.row)">
                    不通过
                </bk-button>
            </template>
        </bk-table-column>
    </self-table>
</template>
<script>
    import { getGroupManage } from '@/api/service/message-service'

    export default {
        name: 'group-approval',
        data () {
            return {
                groupApprovalRemoteData: [],
                loading: false,
                pagination: {
                    current: 1,
                    count: 0,
                    limit: 10
                }
            }
        },
        computed: {
            groupApprovalData (self) {
                return self.groupApprovalRemoteData
            }
        },
        created () {
            this.handleInit()
        },
        methods: {
            toApprovalGroupJoin () {
            },
            handleInit () {
                this.handleGetPageData(this.pagination)
            },
            handleGetPageData (config) {
                const { current: page, limit: size } = config
                if (this.loading) {
                    return
                }
                this.loading = true
              
                return getGroupManage({ page, size }).then(({ data }) => {
                    this.pagination.count = data?.count
                    this.groupApprovalRemoteData = data?.result
                }).finally(_ => {
                    this.loading = false
                })
            }
        }
    }
</script>
<style>

</style>
