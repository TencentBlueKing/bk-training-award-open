<template>
    <self-table :data="awardApprovalRemoteList">
        <bk-table-column label="序列" width="60"></bk-table-column>
        <bk-table-column label="奖项名称"></bk-table-column>
        <bk-table-column label="所属小组"></bk-table-column>
        <bk-table-column label="申请人"></bk-table-column>
        <bk-table-column label="操作">
            <template slot-scope="awardApprovalRecords">
                <bk-button :text="true" @click="toApproval(awardApprovalRecords.row)">
                    前往审批👉
                </bk-button>
            </template>
        </bk-table-column>

    </self-table>
</template>
<script>

    import { DETAIL_ROUTE_PATH } from '@/constants'

    export default {
        name: 'award-approval',
        data () {
            return {
                awardApprovalRemoteList: [{}]
            }
        },
        computed: {
            awardApprovalList (self) {
                return self.awardApprovalList
            }
        },

        methods: {
            toApproval (approvalId) {
                this.$router.push({
                    name: DETAIL_ROUTE_PATH,
                    query: {
                        type: 'approval'
                    }
                })
            }
        }
    }
</script>
