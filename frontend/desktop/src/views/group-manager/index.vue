<template>
    <div class="group-manager-container" v-adjust-table="'container'">
        <bk-button theme="primary"
            icon="plus-circle-shape"
            @click="toAddNewGroup($refs['newGroupDialogForm'])"
        >
            新增组
        </bk-button>
        <bk-table style="margin-top: 15px;"
            :data="tableData"
            :size="size"
            :pagination="pagination"
            height="80%"
            max-height="calc(100vh-52px)"
            :highlight-current-row="true"
            @page-change="handlePageChange"
            @page-limit-change="handlePageLimitChange"
        >
            <bk-table-column v-for="(rowLabel,rowProp) in tableSettings"
                :key="rowProp"
                :label="rowLabel"
            >
                <template slot-scope="prop">
                    <span>{{prop.row[rowProp]}}</span>
                </template>
            </bk-table-column>
            <bk-table-column label="操作" width="150">
                <template slot-scope="props">
                    <bk-button theme="primary" text @click="toEditRow($refs['EditorDialogForm'],props.row)">编辑</bk-button>
                </template>
            </bk-table-column>
        </bk-table>
        <GroupDialog ref="newGroupDialogForm" dialog-type="creator"></GroupDialog>
        <GroupDialog ref="EditorDialogForm" dialog-type="editor"></GroupDialog>
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
                // S 信息控制区
                tableSettings: {
                    organizationName: '组织名',
                    level: '级别',
                    master: '负责人'
                },
                // E 信息控制区
                remoteData: new Array(1000).fill({}),
                pagination: {
                    current: 1,
                    count: 10,
                    limit: 10
                }
            }
        },
        computed: {
            tableData () {
                const tableData = this.remoteData.map((rawData, index) => {
                    // TODO: 装填数据
                    return {
                        organizationName: '测试组织名' + index,
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
        mounted () {
            this.adjustTable()
        },
        methods: {
            adjustTable () {
                // 用于零食改变main-content的状态
                document.querySelector('.main-content').style.minHeight = '0'
                document.querySelector('.main-content').style.height = '100%'
            },
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
