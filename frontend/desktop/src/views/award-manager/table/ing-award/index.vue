<template>
    <self-table :data="ingAwardData" :loading="loading">
        <bk-table-column type="index" label="序号" width="60"></bk-table-column>
        <bk-table-column label="奖项名称" prop="ip"></bk-table-column>
        <bk-table-column label="奖项开始时间" prop="source"></bk-table-column>
        <bk-table-column label="奖项截止时间" prop="status"></bk-table-column>
        <bk-table-column label="奖项咨询人" prop="create_time"></bk-table-column>
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
    export default {
        name: 'ended-approval',
        data () {
            return {
                ingAwardRemoteData: [{}],
                loading: false
            }
        },
        computed: {
            ingAwardData (self) {
                return self.ingAwardRemoteData
            }
        },
        mounted () {
            this.handleInit()
        },
        methods: {
            handleInit () {
            },
            handleGetDetail () {
            }

        }

    }
</script>