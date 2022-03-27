<template>
    <self-table :data="groupApprovalData"
        :pagination.sync="pagination"
        :loading="loading"
        @page-change="handleInit()"
    >
        <bk-table-column label="序号" type="index" width="60"></bk-table-column>
        <bk-table-column label="申请小组" prop="group_name">
        </bk-table-column>
        <bk-table-column label="申请人" prop="display_name_for_display"></bk-table-column>
        <bk-table-column label="申请时间" prop="create_time"></bk-table-column>
        <bk-table-column label="操作">
            <template slot-scope="groupApprovalRecords">
                <bk-button class="mr10" :text="true" @click="handleToPassGroupUser(groupApprovalRecords.row)">
                    通过
                </bk-button>
                <bk-popconfirm trigger="click" :width="280"
                    @confirm="handleRejectGroupUser(groupApprovalRecords.row)"
                >
                    <div slot="content">
                        <div class="demo-custom">
                            <i class="bk-icon icon-info-circle-shape pr5 content-icon color-danger" style="color:red;"></i>
                            <span class="content-text">确认拒绝该用户的申请？</span>
                        </div>
                    </div>
                    <bk-button class="ml10" :text="true"
                        theme="danger"
                    >
                        拒绝
                    </bk-button>
                </bk-popconfirm>
            </template>
        </bk-table-column>
    </self-table>
</template>
<script>

    import { getGroupManage, postGroupManage } from '@/api/service/group-service'
    import { formatUsernameAndDisplayName, formatDate } from '@/common/util'
    import { GROUP_PENDING_APPROVAL } from '@/constants'
    import { tableMixins } from '@/common/mixins/tableMixins'

    export default {
        name: 'group-approval',
        mixins: [tableMixins],
        data () {
            return {
                // 小组审批的远程数据
                groupApprovalRemoteData: []
            }
        },
        computed: {
            groupApprovalData (self) {
                return self.groupApprovalRemoteData?.map(item => {
                    return {
                        apply_id: item['apply_id'],
                        group_id: item['group_id'],
                        group_name: item['group_name'],
                        username: item['username'],
                        display_name: item['display_name'],
                        display_name_for_display: formatUsernameAndDisplayName(item['username'], item['display_name']),
                        status: item['status'],
                        create_time: formatDate(item['create_time']),
                        update_time: formatDate(item['update_time'])
                    }
                }) ?? []
            }
        },
        created () {
            this.handleInit()
        },
        methods: {
            handleInit () {
                Promise.all([
                    this.handleGetPageData()
                ])
            },

            /**
             * 获取数据
             * @param page
             * @param size
             * @return {any}
             * */
            handleGetPageData (page = this.pagination.current, size = this.pagination.limit) {
                if (this.loading) {
                    return
                }
                this.loading = true
                return getGroupManage({ page, size, status: GROUP_PENDING_APPROVAL }).then((response) => {
                    this.groupApprovalRemoteData = response.data
                }).finally(_ => {
                    this.loading = false
                })
            },
            /**
             * 通过用户的申请
             * @param applyInfo
             * @return {any}
             * */
            handleToPassGroupUser (applyInfo) {
                const params = {
                    apply_ids: [applyInfo['apply_id']],
                    is_allow: true
                }
                this.handlePostGroupManage(params, `已同意用户${applyInfo['display_name_for_display']}加入：${applyInfo['group_name']}`)
            },
            /**
             * 拒绝用户的申请
             * @param applyInfo
             * @return {any}
             * */
            handleRejectGroupUser (applyInfo) {
                const params = {
                    apply_ids: [applyInfo['apply_id']],
                    is_allow: false
                }
                this.handlePostGroupManage(params, `已拒绝用户${applyInfo['display_name_for_display']}加入：${applyInfo['group_name']}`)
            },
            /**
             * 处理记录的统一入口
             * @param dealArr
             * @param tips
             * @return {any}
             * */
            handlePostGroupManage (dealArr, tips) {
                return postGroupManage(dealArr).then(_ => {
                    this.messageSuccess(tips)
                    this.handleInit()
                })
            }
        }
    }
</script>
<style>

</style>
