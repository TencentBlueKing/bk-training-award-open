<template>
    <div class="group-manager-container">
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
            max-height="80%"
        >
            <bk-table-column type="index"
                label="序号"
                :width="80"
            ></bk-table-column>
            <bk-table-column
                key="group_full_name"
                label="组织名"
            >
                <template slot-scope="prop">
                    <span>{{prop.row['group_full_name']}}</span>
                </template>
            </bk-table-column>
            <bk-table-column
                key="group_level"
                label="组织名级别"
            >
                <template slot-scope="prop">
                    <span>{{prop.row['group_full_name'] | groupLevel}}</span>
                </template>
            </bk-table-column>
            <bk-table-column
                key="group_full_name"
                label="负责人"
            >
                <template slot-scope="prop">
                    <bk-tag v-for="master in prop.row['master'] || []" :key="master['username']">
                        {{master['displayName']}}
                    </bk-tag>
                </template>
            </bk-table-column>

            <bk-table-column label="操作" width="150">
                <template slot-scope="props">
                    <bk-button theme="primary"
                        @click="toEditRow($refs['EditorDialogForm'],props.row)"
                        :outline="true"
                        :text="true"
                    >编辑</bk-button>
                </template>
            </bk-table-column>
        </bk-table>
        <GroupDialog ref="newGroupDialogForm"
            dialog-type="creator"
            @confirm="handleConfirmAddNewGroup($event)"
            :loading="newGroupLoading"
        >
        </GroupDialog>
        <GroupDialog ref="EditorDialogForm"
            dialog-type="editor"
            :group-disabled="true"
            @confirm="handleConfirmEditGroup($event)">
        </GroupDialog>
    </div>
</template>
<script>
    import { fixMixins, tableMixins } from '@/common/mixins'
    import { getSecretary, postSecretary, putSecretary } from '@/api/service/group-service'

    export default {
        name: 'group-manager',

        components: {
            GroupDialog: () => import('./components/DialogArea/GroupDialog')
        },
        filters: {
            groupLevel (value) {
                const groupLevel = value.split && value.split('/').slice(-1)[0]
                return groupLevel || value
            }
        },
        mixins: [fixMixins, tableMixins],
        data () {
            return {
                // S 状态控制区
                newGroupLoading: false,
                // E 状态控制区
                // S 信息控制区
                tableSettings: {
                    group_full_name: '组织名',
                    master: '负责人'
                },

                // E 信息控制区
                remoteData: []
            }
        },
        computed: {
            tableData (self) {
                const remoteData = self.remoteData
                if (!remoteData || !remoteData.map) {
                    return []
                }
                return remoteData.map((rawData, index) => {
                    return {
                        ...rawData,
                        'group_level': rawData['group_full_name'],
                        master: rawData['secretaries']
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
                return Promise.all(
                    [
                        this.handleGetPageData()
                    ]
                )
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
            handleGetPageData (page = this.pagination.page, size = this.pagination.limit) {
                this.tableDataIsLoading = true
                return getSecretary(page, size).then(res => {
                    this.pagination.count = res.data['count']
                    console.log(res)
                    this.remoteData = res.data['results']
                }).finally(_ => {
                    this.tableDataIsLoading = false
                })
            },

            handleConfirmAddNewGroup (groupForm) {
                if (this.newGroupLoading) {
                    return
                }
                this.newGroupLoading = true
                return postSecretary(groupForm).then(res => {
                    this.messageSuccess('创建成功')
                    /**
                     * 成功后需要更新一下
                     * */
                    this.handleInit()
                }).finally(_ => {
                    this.newGroupLoading = false
                })
            },
            handleConfirmEditGroup (groupForm) {
                return putSecretary(groupForm.id, groupForm).then(_ => {
                    this.messageSuccess('修改成功')
                    this.handleInit()
                }).catch(_ => {
                    this.messageError('修改失败')
                })
            }
        }
    }
</script>

<style scoped>
    @import "./index.css";
</style>
