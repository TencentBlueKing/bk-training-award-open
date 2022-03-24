<template>
    <self-table :data="endedApprovalData"
        :loading="loading"
        :pagination.sync="pagination"
        @page-change="handleInit()"
    >
        <bk-table-column type="index" label="序号" width="60"></bk-table-column>
        <bk-table-column label="奖项名称" prop="award_name"></bk-table-column>
        <bk-table-column label="申请开始时间" prop="application_time"></bk-table-column>
        <bk-table-column label="申请截止时间" prop="end_time"></bk-table-column>
        <bk-table-column label="奖项顾问" prop="award_consultant_display_name_for_display"></bk-table-column>
        <bk-table-column label="操作">
            <template slot-scope="endedApprovals">
                <bk-button @click="handleGetDetail(endedApprovals.row)" :text="true">查看详情</bk-button>
            </template>
        </bk-table-column>
    </self-table>
</template>

<script>
    import { getAwardApproval } from '@/api/service/apply-service'
    import { tableMixins } from '@/views/mycheck/table/tableMixins'
    import {
        DETAIL_APPROVAL_DETAIL,
        DETAIL_ROUTE_PATH,
        DETAIL_TYPE_KEYNAME,
        MYCHECK_AWARD_ENDED_APPROVAL
    } from '@/constants'
    import { formatDate, formatUsernameAndDisplayName } from '@/common/util'

    export default {
        name: 'award-ended-approval',
        mixins: [tableMixins],
        data () {
            return {
                endedApprovalRemoteData: []
            }
        },
        computed: {
            endedApprovalData (self) {
                return self.endedApprovalRemoteData.map(approval => {
                    const awardInfo = approval['award_info']
                    const applicationUsers = approval.application_users ?? []
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
                })
            }
        },
        mounted () {
            this.handleInit()
        },
        methods: {

            handleInit () {
                Promise.all(
                    [this.handleGetEndedAwardApproval()]
                )
            },
            handleGetEndedAwardApproval (page = this.pagination.current, size = this.pagination.limit) {
                if (this.loading) return
                this.loading = true
                const params = {
                    page,
                    size,
                    group_id: this.$bus.curGlobalGroupId,
                    approval_status: MYCHECK_AWARD_ENDED_APPROVAL
                }
                return getAwardApproval(params).then(response => {
                    const approvals = response.data
                    this.pagination.count = approvals?.count
                    this.endedApprovalRemoteData = approvals?.results
                }).finally(_ => {
                    this.loading = false
                })
            },
            handleGetDetail (approval) {
                this.$router.push({
                    name: DETAIL_ROUTE_PATH,
                    query: {
                        [DETAIL_TYPE_KEYNAME]: DETAIL_APPROVAL_DETAIL,
                        record_id: approval['approval_id'],
                        award_id: approval['award_id']
                    }
                })
            }

        }

    }
</script>
