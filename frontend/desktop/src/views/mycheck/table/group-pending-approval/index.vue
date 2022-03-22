<template>
    <self-table :data="pendingApprovalData"
        :loading="false"
        :pagination.sync="pagination"
        @page-change="handleInit()"
    >
        <bk-table-column type="index" label="序号" width="60"></bk-table-column>
        <bk-table-column label="申请用户" prop="display_name_for_display"></bk-table-column>
        <bk-table-column label="申请时间" prop="create_time"></bk-table-column>
        <bk-table-column label="奖项咨询人" prop="create_time"></bk-table-column>
        <bk-table-column label="操作">
            <template slot-scope="approvals">
                <bk-button @click="handleToPassGroupUser(approvals.row)"
                    :text="true"
                    class="mr10"
                >
                    通过
                </bk-button>
                <bk-popconfirm trigger="click" :width="280"
                    @confirm="handleRejectGroupUser(approvals.row)"
                >
                    <div slot="content">
                        <div class="demo-custom">
                            <i class="bk-icon icon-info-circle-shape pr5 content-icon color-danger" style="color:red;"></i>
                            <span class="content-text">确认拒绝该用户的申请？</span>
                        </div>
                    </div>
                    <bk-button
                        theme="danger"
                        :text="true"
                        class="mr10 ml10"
                    >
                        拒绝
                    </bk-button>
                </bk-popconfirm>
            </template>
        </bk-table-column>
    </self-table>
</template>

<script>
    import { tableMixins } from '@/views/mycheck/table/tableMixins'
    import { getGroupManage, postGroupManage } from '@/api/service/group-service'
    import { GROUP_PENDING_APPROVAL } from '@/constants'
    import { formatUsernameAndDisplayName } from '@/common/util'

    export default {
        name: 'group-pending-approval',
        mixins: [tableMixins],
        data () {
            return {
                pendingApprovalRemoteData: []
            }
        },
        computed: {
            pendingApprovalData (self) {
                return self.pendingApprovalRemoteData?.map(item => {
                    return {
                        apply_id: item['apply_id'],
                        group_id: item['group_id'],
                        group_name: item['group_name'],
                        username: item['username'],
                        display_name: item['display_name'],
                        display_name_for_display: formatUsernameAndDisplayName(item['username'], item['display_name']),
                        status: item['status'],
                        create_time: item['create_time'],
                        update_time: item['update_time']
                    }
                }) ?? []
            }
        },
        mounted () {
            this.handleInit()
        },
        methods: {
            handleInit () {
                Promise.all([
                    this.handleGetGroupPendingApproval()
                ])
            },
            handleGetGroupPendingApproval () {
                if (this.loading) return
                this.loading = true
                const params = {
                    group_id: this.$bus.curGlobalGroupId,
                    status: GROUP_PENDING_APPROVAL
                }
                return getGroupManage(params).then(response => {
                    this.pendingApprovalRemoteData = response.data
                }).finally(_ => {
                    this.loading = false
                })
            },
            handleToPassGroupUser (applyInfo) {
                const params = {
                    apply_ids: [applyInfo['apply_id']],
                    is_allow: true
                }
                this.handlePostGroupManage(params, `已同意用户：${applyInfo['display_name_for_display']}加入${applyInfo['group_name']}`)
            },
            handleRejectGroupUser (applyInfo) {
                const params = {
                    apply_ids: [applyInfo['apply_id']],
                    is_allow: false
                }
                this.handlePostGroupManage(params, `已拒绝用户：${applyInfo['display_name_for_display']}加入${applyInfo['group_name']}`)
            },
            /**
             * 处理记录的统一入口
             * */
            handlePostGroupManage (dealArr, tips) {
                return postGroupManage(dealArr).then(response => {
                    this.messageSuccess(tips)
                    this.handleInit()
                })
            }
        }
    }
</script>
