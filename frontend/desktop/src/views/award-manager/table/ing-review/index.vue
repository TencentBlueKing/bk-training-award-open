<template>
    <div>
        <!-- S 待审批表格主体 -->
        <self-table :data="ingReviewData"
            :loading="loading"
            :pagination.sync="pagination"
            @page-change="handleInit()"
        >
            <bk-table-column type="index" label="序号" width="60"></bk-table-column>
            <bk-table-column label="奖项名称" prop="award_name" :width="200">
                <template slot-scope="ingAwards">
                    <award-title :award="ingAwards.row" :title="ingAwards.row['award_name']">
                        {{ ingAwards.row['award_name'] }}
                    </award-title>
                </template>
            </bk-table-column>
            <bk-table-column label="申请开始时间" prop="start_time"></bk-table-column>
            <bk-table-column label="申请截止时间" prop="end_time"></bk-table-column>
            <bk-table-column label="奖项咨询人">
                <template slot-scope="ingAwards">
                    <span
                        :title="ingAwards.row['award_consultant_displayname_for_display']"
                    >

                        {{ ingAwards.row['award_consultant_displayname_for_display'] }}
                    </span>
                </template>
            </bk-table-column>

            <bk-table-column label="总评审轮次">
                <template slot-scope="ingAwards">
                    <bk-select
                        :value="1"
                        :clearable="false"
                    >
                        <bk-option v-for="(item,index) in ingAwards.row['award_reviewers_for_display']"
                            :key="item['uuid']"
                            :name="item['description']"
                            :id="index + 1"
                            :title="item['description']"
                        ></bk-option>
                    </bk-select>
                </template>
            </bk-table-column>
            <bk-table-column label="操作" :width="300">
                <template slot-scope="ingReviewAwards">
                    <bk-button class="mr10"
                        :text="true"
                        @click="toGetAwardApplicationDetail(ingReviewAwards.row,true)"
                    >
                        申请详情
                    </bk-button>
                    <bk-button theme="danger"
                        class="mr20 ml20 "
                        :text="true"
                        @click="toGetAwardApplicationDetail(ingReviewAwards.row,false)"
                    >
                        结束奖项
                    </bk-button>
                </template>
            </bk-table-column>
        </self-table>
        <!-- E 待审批表格主体 -->
        <!-- S 侧边框结束 -->
        <!-- S 申请详情 -->
        <slider-layout ref="application-detail"
            :header-title="curAwardInfo['award_name']"
            :width="650"
        >
            <div slot="content">
                <self-table :data="ingAwardApplicationDetailData"
                    :loading="loading"
                    :pagination.sync="ingAwardApplicationDetailPagination"
                >
                    <bk-table-column label="序号" type="index" :width="80"></bk-table-column>
                    <bk-table-column label="申请人">
                        <template slot-scope="ingAwardApplication">
                            <span :title="ingAwardApplication.row['application_user_for_display']"
                                v-text="ingAwardApplication.row['application_user_for_display']"
                            ></span>
                        </template>
                    </bk-table-column>
                    <bk-table-column label="评审轮次" :width="300">
                        <template slot-scope="pendingAwards">
                            <bk-select
                                :value="pendingAwards.row['approval_turn'] || 1"
                                :clearable="false"
                            >
                                <bk-option v-for="(item,index) in pendingAwards.row['award_reviewers_for_display']"
                                    :key="item['uuid']"
                                    :name="item['description']"
                                    :id="index + 1"
                                    :title="item['description']"
                                ></bk-option>
                            </bk-select>
                        </template>
                    </bk-table-column>
                    <bk-table-column label="评审结果" :width="90">
                        <template slot-scope="pendingAwards">
                            <approval-state-tag :approval-state-cn="pendingAwards.row['approval_state_cn']"
                                :approval-state-en="pendingAwards.row['approval_state_en']"
                            ></approval-state-tag>
                        </template>
                    </bk-table-column>
                </self-table>
            </div>
            <div slot="footer">
                <bk-button theme="danger"
                    class="ml20 mr20"
                    @click="$refs['application-detail'].hidden()"
                >取消
                </bk-button>
                <bk-button theme="warning"
                    class="ml20 mr20"
                    @click="toGetAwardApplicationDetail(curAwardInfo,isOnlyDetail,false)"
                >刷新
                </bk-button>
                <bk-popconfirm trigger="click"
                    :width="280"
                    @confirm="handleToOverAward(curAwardInfo)"
                >
                    <div slot="content">
                        <div>
                            <i class="bk-text-danger bk-icon icon-info-circle-shape content-icon"></i>
                            <span class="content-text pb10 mb20">结束后，所有评审中的申请将设置为
                                <em class="bk-text-danger"> 未通过</em>
                            </span>
                        </div>
                    </div>
                    <bk-button theme="success"
                        class="ml20 mr20"
                        v-show="!isOnlyDetail"
                    >确认结束奖项
                    </bk-button>
                </bk-popconfirm>
            </div>
        </slider-layout>
        <!-- E 申请详情 -->
        <!-- E 侧边框结束 -->
    </div>

</template>

<script>
    import { getAwards, postFinishAward } from '@/api/service/award-service'
    import { paginationTemplate, tableMixins } from '@/common/mixins/tableMixins'
    import {
        APPLY_APPROVAL_STATE_EN_MAP,
        APPLY_APPROVAL_STATE_MAP,
        AWARD_APPLICATION_DETAILS_ROUTE_PATH, AWARD_FORM_ROUTE_PATH, AWARD_TYPE_DETAIL, AWARD_TYPE_ROUTE_KEY,
        ING_REVIEW
    } from '@/constants'
    import { getAwardApplication } from '@/api/service/apply-service'
    import { uuid } from '@/common/uuid'
    import { formatDate, formatUsernameAndDisplayName } from '@/common/util'
    import AwardTitle from '@/views/award-manager/award-title'

    export default {
        name: 'ended-approval',
        components: {
            AwardTitle,
            ApprovalStateTag: () => import('@/views/award-manager/approval-state-tag'),
            SliderLayout: () => import('@/views/award-manager/slider-layout')
        },
        mixins: [tableMixins],
        data () {
            return {
                // 待审批的奖项远端数据收集，用于后续的 computed 格式化数据
                ingReviewRemoteData: [],
                // 待审批的奖项申请详情 远端数据收集
                ingReviewApplicationDetailRemoteData: [],
                // 待审批的奖项申请详情 分页配置，pagination 来自于 tableMixins
                ingAwardApplicationDetailPagination: { ...paginationTemplate },
                // 当前查看详情的奖项信息
                curAwardInfo: {},
                // 是否只是详情，如果只是详情的话，就不显示 确认结束奖项的按钮
                isOnlyDetail: false
            }
        },
        computed: {
            ingReviewData (self) {
                return self.ingReviewRemoteData?.map(award => {
                    const awardReviewers = award['award_reviewers']?.map((reviewers, index) => {
                        return {
                            uuid: uuid.get(),
                            description: '第' + (index + 1) + '轮:' + reviewers.join(',') ?? ''
                        }
                    }) ?? []
                    return {
                        award_id: award['id'],
                        award_name: award['award_name'],
                        award_description: award['award_description'],
                        award_department_fullname: award['award_department_fullname'],
                        award_department_id: award['award_department_id'],
                        award_reviewers: award['award_reviewers'],
                        award_reviewers_for_display: awardReviewers,
                        award_consultant: award['award_consultant'],
                        award_consultant_displayname: award['award_consultant_displayname'],
                        award_consultant_displayname_for_display: formatUsernameAndDisplayName(award['award_consultant'], award['award_consultant_displayname']),
                        award_demand: award['award_demand'],
                        start_time: formatDate(award['start_time']),
                        end_time: formatDate(award['end_time']),
                        approval_state: award['approval_state'],
                        approval_state_en: APPLY_APPROVAL_STATE_EN_MAP[award['approval_state']],
                        approval_state_cn: APPLY_APPROVAL_STATE_MAP[award['approval_state']]
                    }
                })
            },
            ingAwardApplicationDetailData (self) {
                return self.ingReviewApplicationDetailRemoteData?.map(application => {
                    const applicationUser = application['application_users']?.[0] ?? {}
                    const awardInfo = application['award_info']
                    const awardReviewers = awardInfo['award_reviewers']?.map((reviewers, index) => {
                        return {
                            uuid: uuid.get(),
                            description: '第' + (index + 1) + '轮:' + reviewers.join(',') ?? ''
                        }
                    }) ?? []
                    return {
                        application_id: application['id'],
                        award_id: application['award_id'],
                        award_department_id: application['award_department_id'],
                        approval_turn: application['approval_turn'],
                        approval_text: application['approval_text'] || '暂无评语',
                        approval_state: application['approval_state'],
                        award_reviewers_for_display: awardReviewers,
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
                Promise.all([this.handleGetIngReview()])
            },

            handleGetIngReview (page = this.pagination.current, size = this.pagination.limit) {
                if (this.loading) return
                this.loading = true
                const params = {
                    page,
                    size,
                    award_status: ING_REVIEW,
                    group_id: this.$bus.curGlobalGroupId
                }
                return getAwards(params).then(response => {
                    const pendingStartAwards = response.data
                    this.pagination.count = pendingStartAwards.count
                    this.ingReviewRemoteData = pendingStartAwards.data
                }).finally(_ => {
                    this.loading = false
                })
            },
            handleToGetDetail (awardInfo) {
                console.log(awardInfo)
                this.$router.push({
                    name: AWARD_APPLICATION_DETAILS_ROUTE_PATH,
                    query: {
                        award_id: awardInfo['award_id'],
                        group_id: this.$bus.curGlobalGroupId
                    }
                })
            },
            /**
             * @description 确认结束奖项
             * @param awardInfo
             * @return {any}
             * */
            handleToOverAward (awardInfo) {
                const { award_id: awardId } = awardInfo
                return postFinishAward({ awardId }).then(response => {
                    this.handleInit()
                    this.messageSuccess('已成功终止奖项评审')
                    this.toHiddenAwardApplicationInfo()
                })
            },
            /**
             * @description 获取数据，弹出侧栏
             * @param {object} awardInfo 奖项信息
             * @param {boolean} isOnlyDetail 是否是侧栏详情信息
             * @param trigger
             * @return {any}
             * */
            toGetAwardApplicationDetail (awardInfo, isOnlyDetail, trigger = true) {
                this.curAwardInfo = awardInfo
                const awardId = awardInfo['award_id']
                this.loading = true
                this.toShowAwardApplicationInfo()
                this.isOnlyDetail = isOnlyDetail
                return getAwardApplication({
                    id: awardId
                }).then(response => {
                    const awardApplicationDetailData = response.data
                    this.ingAwardApplicationDetailPagination.count = awardApplicationDetailData.count ?? 0
                    this.ingReviewApplicationDetailRemoteData = awardApplicationDetailData.results ?? []
                    return Promise.resolve()
                }).then(_ => {
                    if (trigger) {
                        return this.toShowAwardApplicationInfo()
                    }
                }).finally(_ => {
                    this.loading = false
                })
            },

            toShowAwardApplicationInfo () {
                this.$refs['application-detail'].show()
            },
            toHiddenAwardApplicationInfo () {
                this.$refs['application-detail'].hidden()
            },
            handleToCheckAward (awardInfo) {
                this.$router.push({
                    name: AWARD_FORM_ROUTE_PATH,
                    query: {
                        [AWARD_TYPE_ROUTE_KEY]: AWARD_TYPE_DETAIL,
                        award_id: awardInfo['award_id'],
                        group_id: awardInfo['award_department_id']
                    }
                })
            }
            
        }

    }
</script>
