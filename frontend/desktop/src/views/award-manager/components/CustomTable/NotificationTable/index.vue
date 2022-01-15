<template>
    <SelfTable :data="tableData">
        <SelfTableColumn label="获奖人" prop="prizewinner"></SelfTableColumn>
        <SelfTableColumn label="奖金（元）" prop="bonus"></SelfTableColumn>
        <SelfTableColumn label="评语" prop="committer"></SelfTableColumn>
    </SelfTable>
</template>
<script>
    export default {
        name: 'notification',
        components: {
            SelfTable: () => import('../../CustomTable/table'),
            SelfTableColumn: () => import('../../CustomTable/table-column')
        },
        data () {
            return {
                tableData: [
                    {
                        prizewinner: '测试奖项名称',
                        bonus: '测试评审周期',
                        committer: '测试导向'
                    }
                ]
            }
        },
        mounted () {
        }
    }
</script>
<style>

</style>
