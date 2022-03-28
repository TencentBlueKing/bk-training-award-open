<template>
    <self-table :data="endedApprovalData"
        :loading="loading"
        :pagination.sync="pagination"
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
        <bk-table-column label="申请开始时间" prop="application_time"></bk-table-column>
        <bk-table-column label="申请截止时间" prop="end_time"></bk-table-column>
        <bk-table-column label="申请理由" prop="application_reason">
            <template slot-scope="application">
                <span :title="application.row['application_reason']">
                    {{application.row['application_reason']}}
                </span>
            </template>
        </bk-table-column>
        <bk-table-column label="审批轮次">
            <template slot-scope="approval">
                <span :title="approval.row['approval_turn']">
                    第 {{approval.row['approval_turn']}} 轮
                </span>
            </template>
        </bk-table-column>
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
    import { tableMixins } from '@/common/mixins/tableMixins'
    import {
        DETAIL_APPROVAL_RESULT_DETAIL,
        DETAIL_ROUTE_PATH,
        DETAIL_TYPE_KEYNAME,
        MYCHECK_AWARD_ENDED_APPROVAL
    } from '@/constants'
    import { formatDate, formatUsernameAndDisplayName, setTitle } from '@/common/util'

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
                const endedApprovalRemoteData = self.endedApprovalRemoteData
              
                const list = endedApprovalRemoteData?.map(approval => {
                    const applicationInfo = approval['application_info']
                    const awardInfo = applicationInfo?.['award_info'] ?? {}
                    const applicationUsers = applicationInfo?.['application_users'] ?? []
                    const applicationUser = applicationUsers[0]
                    return {
                        approval_id: approval['id'],
                        application_id: approval['application_id'],
                        award_id: applicationInfo['award_id'],
                        award_department_id: approval['award_department_id'],
                        application_time: formatDate(applicationInfo['application_time']),
                        application_reason: applicationInfo['application_reason'] || '未填写申请理由',
                        application_user: formatUsernameAndDisplayName(applicationUser?.['username'], applicationUser?.['display_name']),
                        application_users: applicationUsers['application_users'],
                        application_attachments: approval['application_attachments'],
                        approval_state: approval['approval_state'],
                        approval_turn: approval['approval_turn'] + 1,
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
                // 一个合并方案
                // const endedApprovalData = list.filter(item => {
                //     // 在下面打上标记，如果被读过就扔掉，因为是同一个申请
                //     if (item.is_leaf) return false
                //     item.children = list.filter(_ => {
                //         // 首先判断是否是同一个申请的审批
                //         if (item.application_id !== _.application_id) {
                //             return false
                //         }
                //         // 如果是同一轮那就 g 了
                //         if (item.approval_turn === _.approval_turn) {
                //             return false
                //         }
                //         // 如果不是同意轮 打上标记
                //         _.is_leaf = true
                //         return true
                //     })
                //     return item
                // })
                // console.log(endedApprovalData)
                return list
            }
        },
        created () {
            this.handleInit()
        },
        methods: {

            handleInit () {
                Promise.all(
                    [this.handleGetEndedAwardApproval()]
                )
                setTitle('奖项审批结果')
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
                        [DETAIL_TYPE_KEYNAME]: DETAIL_APPROVAL_RESULT_DETAIL,
                        record_id: approval['approval_id'],
                        award_id: approval['award_id']
                    }
                })
            }

        }

    }
</script>
