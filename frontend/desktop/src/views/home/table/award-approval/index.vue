<template>
    <self-table :data="awardApprovalList"
        :pagination.sync="pagination"
        :loading="loading"
        :max-height="400"
        @page-change="handleInit"
    >
        <bk-table-column type="index" label="序号" width="60"></bk-table-column>
        <bk-table-column label="奖项名称" prop="award_name"></bk-table-column>
        <bk-table-column label="申请开始时间" prop="application_time"></bk-table-column>
        <bk-table-column label="申请截止时间" prop="end_time"></bk-table-column>
        <bk-table-column label="奖项顾问" prop="award_consultant_display_name_for_display"></bk-table-column>
        <bk-table-column label="操作">
            <template slot-scope="approvals">
                <bk-button class="mr10 ml10" theme="success" :text="true" @click="handleToRefundApplication(approvals.row)">前往审批</bk-button>
            </template>
        </bk-table-column>
    </self-table>
</template>
<script>

    import { DETAIL_APPROVAL, DETAIL_ROUTE_PATH, DETAIL_TYPE_KEYNAME, MYAPPLY_PENDING_APPLY } from '@/constants'
    import { getAwardApproval } from '@/api/service/apply-service'
    import { formatDate, formatUsernameAndDisplayName } from '@/common/util'

    export default {
        name: 'award-approval',
        data () {
            return {
                awardApprovalRemoteList: [],
                loading: false,
                pagination: {
                    current: 1,
                    count: 0,
                    limit: 10
                }
            }
        },
        computed: {
            awardApprovalList (self) {
                return self.awardApprovalRemoteList?.map(approval => {
                    const awardInfo = approval['award_info']
                    const applicationUsers = approval.application_users ?? []
                    console.log(awardInfo)
                    console.log(approval)
                    return {
                        approval_id: approval['id'],
                        award_id: approval['award_id'],
                        award_department_id: approval['award_department_id'],
                        application_time: formatDate(approval['application_time']),
                        application_reason: approval['application_reason'],
                        application_user: formatUsernameAndDisplayName(applicationUsers[0]?.['username'], applicationUsers[0]?.['display_name']),
                        application_users: approval['application_users'],
                        application_attachments: approval['application_attachments'],
                        approval_state: approval['approval_state'],
                        approval_turn: approval['approval_turn'],
                        approval_time: approval['approval_status'],
                        approval_text: approval['approval_text'],
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
        },
        methods: {
            toApproval (approval) {
                this.$router.push({
                    name: DETAIL_ROUTE_PATH,
                    query: {
                        [DETAIL_TYPE_KEYNAME]: DETAIL_APPROVAL,
                        query: {
                            record_id: approval['approval_id'],
                            award_id: approval['award_id'],
                            group_id: approval['award_department_id']
                        }
                    }
                })
            },
            handleInit () {
                this.handleGetPageData()
            },
            handleGetPageData (config = this.pagination) {
                const { current: page, limit: size } = config
                if (this.loading) {
                    return
                }
                this.loading = true
                
                return getAwardApproval({ page, size, approval_status: MYAPPLY_PENDING_APPLY }).then((response) => {
                    const data = response.data
                    this.pagination.count = data?.count ?? 0
                    this.awardApprovalRemoteList = data?.results
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
            }
          
        }
    }
</script>
