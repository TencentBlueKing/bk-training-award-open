<template>
    <SelfTable :data="tableData" v-show="false">
        <SelfTableColumn label="奖项名称" prop="awardName"></SelfTableColumn>
        <SelfTableColumn label="评审周期" prop="bonus"></SelfTableColumn>
        <SelfTableColumn label="导向" prop="committer"></SelfTableColumn>
        <SelfTableColumn label="接口人" prop="interface"></SelfTableColumn>
    </SelfTable>
</template>
<script>
    export default {
        name: 'batch-send-email',
        components: {
            SelfTable: () => import('../table'),
            SelfTableColumn: () => import('../table-column')
        },
        props: {},
        data () {
            return {
                tableData: [
                    {
                        awardName: '测试奖项名称',
                        bonus: '测试评审周期',
                        committer: '测试导向',
                        interface: '测试接口人'
                    }
                ]
            }
        }
    }
</script>
<style>

</style>
