<template>
    <self-table :data="ingApprovalData" :loading="loading">
        <bk-table-column type="index" label="序号" width="60"></bk-table-column>
        <bk-table-column label="奖项名称" prop="ip"></bk-table-column>
        <bk-table-column label="奖项开始时间" prop="source"></bk-table-column>
        <bk-table-column label="奖项截止时间" prop="status"></bk-table-column>
        <bk-table-column label="奖项咨询人" prop="create_time"></bk-table-column>
        <bk-table-column label="当前评审人">
            <template slot-scope="ingApprovals">
                <bk-select :readonly="true">
                    <bk-option>{{ingApprovals.row}}</bk-option>
                </bk-select>
            </template>
        </bk-table-column>
        <bk-table-column label="操作">
            <template slot-scope="ingApprovals">
                <bk-button @click="handleToGetDetail(ingApprovals.row)" :text="true">  查看 </bk-button>
            </template>
        </bk-table-column>
    </self-table>
</template>

<script>
    export default {
        name: 'ing-approval',
        data () {
            return {
                ingApprovalRemoteData: [{}],
                loading: false
            }
        },
        computed: {
            ingApprovalData (self) {
                return self.ingApprovalRemoteData
            }
        },
        mounted () {
            this.handleInit()
        },
        methods: {
            handleInit () {
                console.log('getData')
            },
            handleToGetDetail () {}
        }

    }
</script>
