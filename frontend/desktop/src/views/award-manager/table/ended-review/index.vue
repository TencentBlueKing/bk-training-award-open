<template>
    <!-- 结束奖项页面 -->
    <div>
        <self-table :data="endedReviewData"
            :loading="loading"
            :pagination.sync="pagination"
            @page-change="handleInit()"
        >
            <bk-table-column type="index" label="序号" width="60"></bk-table-column>
            <bk-table-column label="奖项名称" prop="award_name"></bk-table-column>
            <bk-table-column label="奖项开始时间" prop="start_time"></bk-table-column>
            <bk-table-column label="奖项截止时间" prop="end_time"></bk-table-column>
            <bk-table-column label="奖项咨询人" prop="award_consultant_displayname_for_display"></bk-table-column>
            <bk-table-column label="操作">
                <template slot-scope="awards">
                    <bk-button :text="true"
                        @click="handleGetAwardApplications(awards.row)"
                    >
                        查看申请结果
                    </bk-button>
                </template>
            </bk-table-column>
        </self-table>
        <slider-layout ref="application-detail"
            :header-title="'测试奖项名'"
            :width="800"
        >
            <div slot="content">
                <self-table
                    :data="awardApplicationDetailData"
                    :pagination.sync="awardApplicationDetailPagination"
                    :loading="loading"
                    @page-change="handleGetAwardApplications(curAwardInfo)"
                >
                    <bk-table-column label="序号" type="index" :width="80"></bk-table-column>
                    <bk-table-column label="评审结果">
                        <template slot-scope="ingAwardApplication">
                            <span :title="ingAwardApplication.row['approval_state_cn']"
                                v-text="ingAwardApplication.row['approval_state_cn']"
                                :class="['status',ingAwardApplication.row['approval_state_en']]"
                            ></span>
                        </template>
                    </bk-table-column>
                    <bk-table-column label="申请人">
                        <template slot-scope="ingAwardApplication">
                            <span :title="ingAwardApplication.row['application_user_for_display']"
                                v-text="ingAwardApplication.row['application_user_for_display']"
                            ></span>
                        </template>
                    </bk-table-column>
                    <bk-table-column label="评审人">
                        <template slot-scope="ingAwardApplication">
                            <span :title="ingAwardApplication.row['application_user_for_display']"
                                v-text="ingAwardApplication.row['application_user_for_display']"
                            ></span>
                        </template>
                    </bk-table-column>
                    <bk-table-column label="评语">
                        <template slot-scope="ingAwardApplication">
                            <span :title="ingAwardApplication.row['approval_text']"
                                v-text="ingAwardApplication.row['approval_text']"
                            ></span>
                        </template>
                    </bk-table-column>
                </self-table>
            </div>
        </slider-layout>
    </div>
</template>

<script>
    import { tableMixins } from '@/common/mixins/tableMixins'
    import { APPLY_APPROVAL_STATE_EN_MAP, APPLY_APPROVAL_STATE_MAP, ENDED_REVIEW } from '@/constants'
    import { getAwards } from '@/api/service/award-service'
    import { formatDate, formatUsernameAndDisplayName } from '@/common/util'
    import { getAwardApplication } from '@/api/service/apply-service'
    import { uuid } from '@/common/uuid'

    export default {
        name: 'ended-review',
        components: {
            SliderLayout: () => import('@/views/award-manager/slider-layout')
        },
        mixins: [tableMixins],
        data (self) {
            return {
                // 已结束的奖项远端数据收集，用于后续的 computed 计算
                endedReviewRemoteData: [],
                // 已结束的奖项申请详情 远端数据收集
                awardApplicationDetailRemoteData: [],
                // 待审批的奖项申请详情 分页配置，pagination 来自于 tableMixins
                awardApplicationDetailPagination: {
                    count: 0,
                    limit: 10,
                    current: 1
                },
                // 当前查看详情的奖项信息
                curAwardInfo: {}
            }
        },
        computed: {
            endedReviewData (self) {
                return self.endedReviewRemoteData?.map((application, index) => {
                    const awardReviewers = application['award_reviewers']?.map((reviewers, index) => {
                        return {
                            uuid: uuid.get(),
                            description: '第' + (index + 1) + '轮:' + reviewers.join(',') ?? ''
                        }
                    }) ?? []
                    return {
                        $index: index,
                        award_id: application['id'],
                        award_name: application['award_name'],
                        award_description: application['award_description'],
                        award_department_fullname: application['award_department_fullname'],
                        award_department_id: application['award_department_id'],
                        award_reviewers: application['award_reviewers'],
                        award_reviewers_for_display: awardReviewers,
                        award_consultant: application['award_consultant'],
                        award_consultant_displayname: application['award_consultant_displayname'],
                        award_consultant_displayname_for_display: formatUsernameAndDisplayName(application['award_consultant'], application['award_consultant_displayname']),
                        award_demand: application['award_demand'],
                        start_time: formatDate(application['start_time']),
                        end_time: formatDate(application['end_time']),
                        approval_state: application['approval_state'],
                        approval_state_en: APPLY_APPROVAL_STATE_EN_MAP[application['approval_state']],
                        approval_state_cn: APPLY_APPROVAL_STATE_MAP[application['approval_state']]
                    }
                }) ?? []
            },
            awardApplicationDetailData (self) {
                return self.awardApplicationDetailRemoteData?.map(application => {
                    const applicationUser = application['application_users']?.[0] ?? {}
                    return {
                        application_id: application['id'],
                        award_id: application['award_id'],
                        award_department_id: application['award_department_id'],
                        approval_turn: application['approval_turn'],
                        approval_text: application['approval_text'],
                        approval_state: application['approval_state'],
                        approval_state_en: APPLY_APPROVAL_STATE_EN_MAP[application['approval_state']],
                        approval_state_cn: APPLY_APPROVAL_STATE_MAP[application['approval_state']],
                        application_time: formatDate(application['application_time']),
                        application_users: application['application_users'],
                        application_user_for_display: formatUsernameAndDisplayName(applicationUser['username'], applicationUser['display_name'])
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
                    this.handleGetEndedAwardAwards()
                ])
            },
            handleGetEndedAwardAwards (page = this.pagination.current, size = this.pagination.limit) {
                if (this.loading) return
                this.loading = true
                const params = {
                    page,
                    size,
                    award_status: ENDED_REVIEW,
                    group_id: this.$bus.curGlobalGroupId
                }
                return getAwards(params).then(response => {
                    const endedReviewAwards = response.data
                    this.pagination.count = endedReviewAwards?.count ?? 0
                    this.endedReviewRemoteData = endedReviewAwards?.data ?? []
                }).finally(_ => {
                    this.loading = false
                })
            },
            handleGetAwardApplications (awardInfo) {
                const awardId = awardInfo['award_id']
                this.curAwardInfo = awardInfo
                if (this.loading) return
                this.loading = true

                getAwardApplication({
                    id: awardId
                }).then(response => {
                    const awardApplicationDetailData = response.data
                    this.awardApplicationDetailPagination.count = awardApplicationDetailData.count ?? 0
                    this.awardApplicationDetailRemoteData = awardApplicationDetailData.results ?? []
                    return Promise.resolve()
                }).then(
                    _ => {
                        this.toShowAwardApplicationInfo()
                    }
                ).finally(_ => {
                    this.loading = false
                })
            },
            toShowAwardApplicationInfo () {
                // 只做一件事 打开奖项详情
                this.$refs['application-detail'].show()
            }
        }

    }
</script>
<style>
$fontWeightColor: #737987;

$primaryColor: #3c96ff;

$successColor: #34d97b;

$dangerColor: #ff5656;

$warningColor: #ffb400;

.status {

  &.review_pending {
    color: $fontWeightColor
  }

  &.review_passed {
    color: $successColor
  }

  &.review_not_passed {
    color: $dangerColor
  }

  &.draft {
    color: $warningColor
  }
}

</style>
