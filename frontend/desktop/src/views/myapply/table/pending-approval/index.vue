<template>
    <self-table :data="pendingApprovalData"
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
        <bk-table-column label="操作" :width="250">
            <template slot-scope="application">
                <bk-button class="mr10"
                    theme="primary"
                    :text="true"
                    @click="handleToGetDetail(application.row)"
                >
                    详情
                </bk-button>
                <bk-popconfirm title="确认撤回该申请？"
                    content="撤回申请之后需要重新申请！"
                    trigger="click"
                    @confirm="handleToRefundApplication(application.row['approval_id'])"
                >
                    <bk-button class="ml10 mr10"
                        theme="danger"
                        :text="true"
                        v-show="application.row['approval_state'] === APPLY_STATE['review_pending']"
                    >
                        撤回申请
                    </bk-button>
                </bk-popconfirm>
                
                <bk-button class="ml10 mr10"
                    theme="warning"
                    :text="true"
                    @click="handleToEditDraft(application.row)"
                    v-show="application.row['approval_state'] === APPLY_STATE['draft']"
                >
                    编辑草稿
                </bk-button>

            </template>
        </bk-table-column>
    </self-table>
</template>

<script>
    import { APPLY_STATE, DETAIL_APPLY_DETAIL, DETAIL_ROUTE_PATH, DETAIL_TYPE_KEYNAME, MYAPPLY_PENDING_APPLY } from '@/constants'
    import { getRecord } from '@/api/service/apply-service'
    import { applyTableMixins } from '@/views/myapply/table/mixins'
    import { formatDate } from '@/common/util'
    import { deleteRecord } from '@/api/service/award-service'

    export default {
        name: 'pending-approval',
        mixins: [applyTableMixins],
        data () {
            return {
                pendingApprovalRemoteData: [],
                APPLY_STATE: Object.freeze(APPLY_STATE)
            }
        },
        computed: {
            pendingApprovalData (self) {
                return self.pendingApprovalRemoteData.map(item => {
                    const awardInfo = item['award_info'] ?? {}
                    const awardReviewersSteps = awardInfo['award_reviewers'].map((item, index) => {
                        return {
                            title: '审批流程',
                            icon: index + 1,
                            description: item.join(',')
                        }
                    })
                    return {
                        approval_id: item['id'],
                        record_id: item['id'],
                        approval_state: item['approval_state'],
                        application_reason: item['application_reason'],
                        application_time: formatDate(item['application_time']),
                        award_id: item['award_id'],
                        award_name: item['award_info']?.['award_name'],
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
                Promise.all([
                    this.handleGetPendingApproval()
                ])
            },
            handleGetPendingApproval (page = this.pagination.current, size = this.pagination.limit) {
                const params = {
                    page,
                    size,
                    group_id: this.$bus.curGlobalGroupId,
                    apply_status: MYAPPLY_PENDING_APPLY
                }
                if (this.loading) return
                this.loading = true
                return getRecord(params).then(response => {
                    console.log(response)
                  
                    const applications = response.data
                    this.pagination['count'] = applications.count
                    this.pendingApprovalRemoteData = applications.data
                }).finally(_ => {
                    this.loading = false
                })
            },
            handleToRefundApplication (applyId) {
                return deleteRecord(applyId).then(_ => {
                    this.messageWarn('撤回成功')
                    this.handleInit()
                })
            },
            handleToEditDraft (recordInfo) {
                if (!recordInfo['award_id']) {
                    return
                }
                this.$router.push({
                    name: DETAIL_ROUTE_PATH,
                    query: {
                        type: 'edit',
                        award_id: recordInfo['award_id'],
                        record_id: recordInfo['record_id']
                    }
                })
            },
            handleToGetDetail (recordInfo) {
                this.$router.push({
                    name: DETAIL_ROUTE_PATH,
                    query: {
                        [DETAIL_TYPE_KEYNAME]: DETAIL_APPLY_DETAIL,
                        award_id: recordInfo['award_id'],
                        record_id: recordInfo['record_id']
                    }
                })
            },
            handleGetDetail (expand) {
                // magicBox 实例中的展开状态列表
                const expandRows = expand.store['states'].expandRows
                // 当前列
                const curRow = expand.row
                const isExist = expandRows?.some((item, index) => {
                    // 如果当前列已经存在了，那就折叠回去
                    if (item.approval_id === expand.row['approval_id']) {
                        expandRows.splice(index, 1)
                        return true
                    }
                })
                // 如果不存在。添加到展开列中
                if (isExist) return
                expandRows.push(curRow)
            }
        }
    }
</script>
