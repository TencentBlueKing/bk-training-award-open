<template>
    <self-table :data="endedApprovalData"
        :loading="loading"
        :pagination.sync="pagination"
        @page-change="handleInit()"
    >
        <bk-table-column type="index" label="序号" width="60"></bk-table-column>
        <bk-table-column label="奖项名称" prop="award_name"></bk-table-column>
        <bk-table-column label="申请开始时间" prop="start_time"></bk-table-column>
        <bk-table-column label="申请截止时间" prop="end_time"></bk-table-column>
        <bk-table-column label="申请理由">
            <template slot-scope="application">
                <span v-bk-tooltips.light="application.row['application_reason']"> {{application.row['application_reason']}}</span>
            </template>
        </bk-table-column>
        <bk-table-column label="评审结果">
            <template slot-scope="application">
                <approval-state-tag :approval-state-cn="application.row['approval_state_en']"
                    :approval-state-en="application.row['approval_state_en']"
                ></approval-state-tag>
            </template>
        </bk-table-column>
        <bk-table-column label="评语" :width="300">
            <template slot-scope="endedApprovals">
                <span v-bk-tooltips.light="endedApprovals.row['approval_text']"
                >{{endedApprovals.row['approval_text']}}</span>
            </template>
        </bk-table-column>
    </self-table>
</template>

<script>
    import {
        APPLY_APPROVAL_STATE_EN_MAP,
        APPLY_APPROVAL_STATE_MAP,
        DETAIL_ROUTE_PATH,
        MYAPPLY_ENDED_APPROVAL
    } from '@/constants'
    import { getRecord } from '@/api/service/apply-service'
    import { applyTableMixins } from '@/views/myapply/table/mixins'
    import { formatDate } from '@/common/util'
    import ApprovalStateTag from '@/views/award-manager/approval-state-tag'

    export default {
        name: 'ended-approval',
        components: { ApprovalStateTag },
        mixins: [applyTableMixins],
        data () {
            return {
                endedApprovalRemoteData: []
            }
        },
        computed: {
            endedApprovalData (self) {
                return self.endedApprovalRemoteData.map(approval => {
                    const awardInfo = approval['award_info'] ?? {}
                    const awardReviewersSteps = awardInfo['award_reviewers'].map((item, index) => {
                        return {
                            title: '审批流程',
                            icon: index + 1,
                            description: item.join(',')
                        }
                    })
                    return {
                        approval_id: approval['id'],
                        record_id: approval['id'],
                        approval_state: approval['approval_state'],
                        approval_state_en: APPLY_APPROVAL_STATE_EN_MAP[approval['approval_state']],
                        approval_state_cn: APPLY_APPROVAL_STATE_MAP[approval['approval_state']],
                        application_reason: approval['application_reason'],
                        application_time: formatDate(approval['application_time']),
                        award_id: approval['award_id'],
                        award_name: approval['award_info']?.['award_name'],
                        award_department_id: ['award_department_id'],
                        award_department_fullname: awardInfo['award_department_fullname'],
                        award_reviewers: awardInfo['award_reviewers'],
                        award_reviewers_steps: awardReviewersSteps,
                        award_consultant: awardInfo['award_consultant'],
                        award_description: awardInfo['award_description'],
                        award_consultant_displayname: awardInfo['award_consultant_displayname'],
                        award_consultant_displayname_for_display: awardInfo['award_consultant_displayname_for_display'],
                        award_demand: awardInfo['award_demand'],
                        start_time: formatDate(awardInfo['start_time']),
                        end_time: formatDate(awardInfo['end_time'])
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
                    [this.handleGetEndedApproval()]
                )
            },
            handleGetEndedApproval (page = this.pagination.current, size = this.pagination.limit) {
                const params = {
                    page,
                    size,
                    group_id: this.$bus.curGlobalGroupId,
                    apply_status: MYAPPLY_ENDED_APPROVAL
                }
                if (this.loading) return
                this.loading = true
                return getRecord(params).then(response => {
                    const applications = response.data
                    this.pagination['count'] = applications.count
                    this.endedApprovalRemoteData = applications.data
                }).finally(_ => {
                    this.loading = false
                })
            },
            handleToGetDetail (recordInfo) {
                this.$router.push({
                    name: DETAIL_ROUTE_PATH,
                    query: {
                        type: 'detail',
                        award_id: recordInfo['award_id'],
                        record_id: recordInfo['record_id']
                    }
                })
            }
          
        }

    }
</script>
