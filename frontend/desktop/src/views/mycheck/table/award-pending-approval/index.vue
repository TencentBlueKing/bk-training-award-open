<template>
    <self-table :data="pendingApprovalData"
        :pagination.sync="pagination"
        :loading="loading"
        @page-change="handleInit()"
    >
        <bk-table-column type="index" label="序号" width="60"></bk-table-column>
        <bk-table-column label="奖项名称" prop="award_name">
            <template slot-scope="approval">
                <span :title="approval.row['award_name']">
                    {{ approval.row['award_name'] }}
                </span>
            </template>
        </bk-table-column>
        <bk-table-column label="申请人" prop="application_user"></bk-table-column>
        <bk-table-column label="申请时间" prop="application_time"></bk-table-column>
        <bk-table-column label="申请理由">
            <template slot-scope="approval">
                <span :title="approval.row['application_reason']">
                    {{ approval.row['application_reason'] }}
                </span>
            </template>
        </bk-table-column>
        <bk-table-column label="当前审批轮次">
            <template slot-scope="approval">
                <span v-bk-overflow-tips>
                    第 {{approval.row['approval_turn']}} 轮
                </span>
            </template>
        </bk-table-column>
        <bk-table-column label="奖项顾问" prop="award_consultant_display_name_for_display"></bk-table-column>
        <bk-table-column label="操作">
            <template slot-scope="approvals">
                <bk-button class="mr10 ml10" theme="primary" :text="true" @click="handleToRefundApplication(approvals.row)">前往审批</bk-button>
            </template>
        </bk-table-column>
    </self-table>
</template>

<script>
    import { tableMixins } from '@/common/mixins/tableMixins'
    import { getAwardApproval } from '@/api/service/apply-service'
    import {
        DETAIL_APPROVAL,
        DETAIL_ROUTE_PATH,
        DETAIL_TYPE_KEYNAME,
        MYCHECK_AWARD_PENGDING_APPROVAL
    } from '@/constants'
    import { formatDate, formatUsernameAndDisplayName, setTitle } from '@/common/util'

    export default {
        name: 'award-pending-approval',
        mixins: [tableMixins],
        data () {
            return {
                pendingApprovalRemoteData: []
            }
        },
        computed: {
            pendingApprovalData (self) {
                return self.pendingApprovalRemoteData?.map(approval => {
                    const awardInfo = approval['award_info']
                    const applicationUsers = approval.application_users ?? []
                    const applicationUser = applicationUsers[0]
                    return {
                        approval_id: approval['id'],
                        award_id: approval['award_id'],
                        award_department_id: approval['award_department_id'],
                        application_time: formatDate(approval['application_time']),
                        application_reason: approval['application_reason'],
                        application_user: formatUsernameAndDisplayName(applicationUser?.['username'], applicationUser?.['display_name']),
                        application_users: approval['application_users'],
                        application_attachments: approval['application_attachments'],
                        approval_state: approval['approval_state'],
                        approval_turn: approval['approval_turn'] + 1,
                        approval_time: approval['approval_status'],
                        approval_text: approval['approval_text'] || '暂无评语',
                        award_name: awardInfo['award_name'],
                        award_description: awardInfo['award_description'],
                        award_department_fullname: awardInfo['award_department_fullname'],
                        start_time: formatDate(awardInfo['start_time']),
                        end_time: formatDate(awardInfo['end_time']),
                        create_time: formatDate(awardInfo['create_time']),
                        update_time: formatDate(awardInfo['update_time']),
                        award_consultant: awardInfo['award_consultant'],
                        award_consultant_displayname: awardInfo['award_consultant'],
                        award_consultant_display_name_for_display: formatUsernameAndDisplayName(
                            awardInfo['award_consultant'],
                            awardInfo['award_consultant']
                        )
                    }
                }) ?? []
            }
        },
        created () {
            this.handleInit()
            setTitle('奖项待审批')
        },
        methods: {
            handleInit () {
                Promise.all(
                    [this.handleGetPendingApproval()]
                )
            },
            handleGetPendingApproval (page = this.pagination.current, size = this.pagination.limit) {
                if (this.loading) return
                this.loading = true
                const params = {
                    page,
                    size,
                    group_id: this.$bus.curGlobalGroupId,
                    approval_status: MYCHECK_AWARD_PENGDING_APPROVAL
                }
                return getAwardApproval(params).then(response => {
                    const approvals = response.data
                    this.pagination.count = approvals?.count ?? 0
                    this.pendingApprovalRemoteData = approvals?.results ?? []
                }).finally(_ => {
                    this.loading = false
                })
            },
            handleToRefundApplication (approval) {
                this.$router.push({
                    name: DETAIL_ROUTE_PATH,
                    query: {
                        [DETAIL_TYPE_KEYNAME]: DETAIL_APPROVAL,
                        record_id: approval['approval_id'],
                        award_id: approval['award_id'],
                        group_id: approval['award_department_id']
                    }
                })
            },
            handleToEditDraft () {}
        }
    }
</script>
