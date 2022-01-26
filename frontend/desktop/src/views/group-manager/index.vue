<template>
    <div class="group-manager-container" v-adjust-table="'container'">
        <bk-button theme="primary"
            icon="plus-circle-shape"
            @click="toAddNewGroup($refs['newGroupDialogForm'])"
        >
            新增组
        </bk-button>
        <bk-table size="small"
            ext-cls="mt15"
            :data="tableData"
            :pagination="pagination"
            :highlight-current-row="true"
            @page-change="handlePageChange($event)"
            @page-limit-change="handlePageLimitChange($event)"
            v-bkloading="{ isLoading: tableDataIsLoading ,title: '加载中' }"
            height="80%"
        >
            <bk-table-column type="index"
                label="序号"
                :width="80"
            ></bk-table-column>
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
                    <bk-button theme="primary"
                        @click="toEditRow($refs['EditorDialogForm'],props.row)"
                        outline
                    >编辑</bk-button>
                </template>
            </bk-table-column>
        </bk-table>
        <GroupDialog ref="newGroupDialogForm" dialog-type="creator"></GroupDialog>
        <GroupDialog ref="EditorDialogForm" dialog-type="editor"></GroupDialog>
    </div>
</template>
<script>
    import { fixMixins, tableMixins } from '@/common/mixins'
    export default {
        name: 'group-manager',

        components: {
            GroupDialog: () => import('./components/DialogArea/GroupDialog')
        },
        mixins: [fixMixins, tableMixins],
        data () {
            return {
                // S 信息控制区
                tableSettings: {
                    name: '组织名',
                    level: '级别',
                    master: '负责人'
                },
                // E 信息控制区
                remoteData: []
            }
        },
        computed: {
            tableData () {
                const remoteData = this.remoteData
                if (!remoteData.map) {
                    return []
                }
                return remoteData.map((rawData, index) => {
                    return {
                        ...rawData,
                        name: rawData['name'],
                        level: rawData['level'],
                        organisation: rawData['full_name'],
                        master: '测试操作'
                    }
                })
            }
        },
        created () {
            this.handleInit()
        },
        methods: {
            /**
             *  初始化函数
             * */
            handleInit () {
                this.handleGetPageData(1, 10)
            },
            // 弹出框控制区域
            toAddNewGroup (toAddNewGroup) {
                toAddNewGroup.show()
            },
            toEditRow (toEditDialogForm, rawData) {
                toEditDialogForm.show({
                    data: rawData
                })
            },
            /**
             * 页面改变发起请求
             * */
            handlePageChange (page) {
                this.pagination.page = page
                return this.handleGetPageData(page, this.pagination.limit)
            },
            /**
             * 页面尺寸改变触发请求，需要把页面归为 1
             * */
            handlePageLimitChange (limit) {
                this.pagination.page = 1
                this.pagination.limit = limit
                return this.handleGetPageData(this.pagination.page, limit)
            },
            /**
             * @description 获取组信息
             * @param {number} page
             * @param {number} size
             * */
            handleGetPageData (page, size) {
                this.tableDataIsLoading = true

                return this.$http.get('/usermanage/list_departments/').then(res => {
                    this.remoteData = res.data.results
                }).finally(_ => {
                    this.tableDataIsLoading = false
                })
            }
        }
    }
</script>

<style scoped>
    @import "./index.css";
</style>
