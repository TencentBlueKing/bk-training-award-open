<template>
    <self-table :data="awardApprovalRemoteList"
        :pagination.sync="pagination"
        :loading="loading"
        @page-change="handleGetPageData"
    >
        <bk-table-column label="序列" width="60"></bk-table-column>
        <bk-table-column label="奖项名称"></bk-table-column>
        <bk-table-column label="所属小组"></bk-table-column>
        <bk-table-column label="申请人"></bk-table-column>
        <bk-table-column label="操作">
            <template slot-scope="awardApprovalRecords">
                <bk-button :text="true" @click="toApproval(awardApprovalRecords.row)">
                    前往审批
                </bk-button>
            </template>
        </bk-table-column>
    </self-table>
</template>
<script>

    import { DETAIL_ROUTE_PATH } from '@/constants'
    import { getApproval } from '@/api/service/apply-service'

    export default {
        name: 'award-approval',
        data () {
            return {
                awardApprovalRemoteList: [],
                loading: false,
                pagination: {
                    current: 1,
                    count: 0,
                    limit: 10
                }
            }
        },
        computed: {
            awardApprovalList (self) {
                return self.awardApprovalList
            }
        },
        created () {
            this.handleInit()
        },
        methods: {
            toApproval (approvalId) {
                this.$router.push({
                    name: DETAIL_ROUTE_PATH,
                    query: {
                        type: 'approval'
                    }
                })
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
                return getApproval({ page, size }).then(({ data }) => {
                    this.pagination.count = data.count
                    this.awardApprovalRemoteList = data.result
                }).finally(_ => {
                    this.loading = false
                })
            }
          
        }
    }
</script>
