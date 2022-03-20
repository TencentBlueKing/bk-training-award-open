<template>
    <self-table :data="pendingApprovalData"
        :loading="false"
        :pagination.sync="pagination"
        @page-change="handleInit()"
    >
        <bk-table-column type="index" label="序号" width="60"></bk-table-column>
        <bk-table-column label="奖项名称" prop="ip"></bk-table-column>
        <bk-table-column label="奖项开始时间" prop="source"></bk-table-column>
        <bk-table-column label="奖项截止时间" prop="status"></bk-table-column>
        <bk-table-column label="奖项咨询人" prop="create_time"></bk-table-column>
        <bk-table-column label="操作">
            <template slot-scope="approvals">
                <bk-button @click="handleToPassGroupUser(approvals.row)"
                    :text="true"
                    class="mr10"
                >
                    通过
                </bk-button>
                <bk-popconfirm trigger="click" :width="280">
                    <div slot="content">
                        <div class="demo-custom">
                            <i class="bk-icon icon-info-circle-shape pr5 content-icon color-danger"></i>
                            <span class="content-text">确认拒绝该用户的申请？</span>
                        </div>
                    </div>
                    <bk-button @click="handleRejectGroupUser(approvals.row)"
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
    import { getGroupApproval, postGroupManage } from '@/api/service/group-service'
    import { GROUP_PENDING_APPROVAL } from '@/constants'
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
                return self.pendingApprovalRemoteData
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
            handleGetGroupPendingApproval (page = this.pagination.curren, size = this.pagination.limit) {
                if (this.loading) return
                this.loading = true
                const params = {
                    page,
                    size,
                    group_id: this.$bus.curGlobalGroupId,
                    approval_state: GROUP_PENDING_APPROVAL
                }
                return getGroupApproval(params).then(response => {
                    const groupApprovals = response.data
                    console.log(groupApprovals)
                }).finally(_ => {
                    this.loading = false
                })
            },
            handleToPassGroupUser (applyInfo) {
                const params = {
                    apply_id: applyInfo['applyId'],
                    is_allow: true
                }
                this.handlePostGroupManage([params])
            },
            handleRejectGroupUser (applyInfo) {
                const params = {
                    apply_id: applyInfo['applyId'],
                    is_allow: false
                }
                this.handlePostGroupManage([params])
            },
            /**
             * 处理记录的统一入口
             * */
            handlePostGroupManage (dealArr) {
                return postGroupManage(dealArr).then(response => {
                    console.log(response)
                }).finally(_ => {
                  
                })
            }
        }
    }
</script>
