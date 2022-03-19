<template>
    <self-table>
        <bk-table-column type="index" label="序号" width="60"></bk-table-column>
        <bk-table-column label="奖项名称" prop="ip"></bk-table-column>
        <bk-table-column label="奖项开始时间" prop="source"></bk-table-column>
        <bk-table-column label="奖项截止时间" prop="status"></bk-table-column>
        <bk-table-column label="奖项咨询人" prop="create_time"></bk-table-column>
        <bk-table-column label="操作">
            <template>

            </template>
        </bk-table-column>
    </self-table>
</template>

<script>
    export default {
        name: 'pending-approval',
        data () {
            return {}
        },
        methods: {
            handleInit () {}
        }
    }
</script>
