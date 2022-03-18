<template>
    <self-table>
        <bk-table-column label="序列" width="60"></bk-table-column>
        <bk-table-column label="申请人"></bk-table-column>
        <bk-table-column label="操作">
            <template slot-scope="groupApprovalRecords">
                <bk-button :text="true" @click="toApprovalGroupJoin(groupApprovalRecords.row)">
                    通过👉
                </bk-button>
                <bk-button :text="true" @click="toApprovalGroupJoin(groupApprovalRecords.row)">
                    不通过👉
                </bk-button>
            </template>
        </bk-table-column>
    </self-table>
</template>
<script>
    export default {
        name: 'group-approval',
        data () {
            return {}
        },
        methods: {
            toApprovalGroupJoin () {
            
            }
        }
    }
</script>
<style>

</style>
