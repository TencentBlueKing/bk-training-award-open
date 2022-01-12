<template>
    <div class="group-manager-container">
        <div>
            <bk-button theme="primary" @click="toAddNewGroup($refs['newGroupDialogForm'])">新增组</bk-button>
            <bk-table style="margin-top: 15px;"
                :data="tableData"
                :size="size"
                :pagination="pagination"
                height="500px"
                @page-change="handlePageChange"
                @page-limit-change="handlePageLimitChange">
                <bk-table-column prop="organizationName" label="组织名"></bk-table-column>
                <bk-table-column prop="level" label="级别"></bk-table-column>
                <bk-table-column prop="organisation" label="所属组织"></bk-table-column>
                <bk-table-column prop="master" label="负责人"></bk-table-column>
                <bk-table-column label="操作" width="150">
                    <template slot-scope="props">
                        <bk-button theme="primary" text @click="toEditRow($refs['EditorDialogForm'],props.row)">编辑</bk-button>
                    </template>
                </bk-table-column>
            </bk-table>
        </div>
        <GroupDialog ref="newGroupDialogForm"></GroupDialog>
        <GroupDialog ref="EditorDialogForm"></GroupDialog>
    </div>
</template>
<script>
    import { GroupDialog } from './components/DialogArea'
    export default {
        name: 'group-manager',
        components: {
            GroupDialog
        },
        data () {
            return {
                size: 'small',
                remoteData: new Array(100).fill({}),
                pagination: {
                    current: 1,
                    count: 10,
                    limit: 10
                }
            }
        },
        computed: {
            tableData () {
                const tableData = this.remoteData.map(rowData => {
                    // TODO: 装填数据
                    return {
                        organizationName: '测试组织名',
                        level: '测试级别',
                        organisation: '测试所属组织',
                        master: '测试操作'
                    }
                })
                return tableData
            }
        },
        create () {
            this.notImplemented = (feature) => {
                const message = `正在开发: ${feature}`
                alert(message)
                throw new Error(message)
            }
        },
        methods: {
            // 弹出框控制区域
            toAddNewGroup (toAddNewGroup) {
                // TODO: 弹出
                console.log(toAddNewGroup)
                toAddNewGroup.show()
            },
            toEditRow (toEditDialogForm, rawData) {
                console.log(rawData)
                toEditDialogForm.show({
                    data: rawData
                })
            },
            // 请求发起区域
            handlePageChange () {
                this.notImplemented('切换页面')
            }
        }
    }
</script>

<style>
    @import "./index.css";
</style>
