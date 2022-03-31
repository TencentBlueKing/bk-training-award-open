<template>
    <!-- 可申请奖项页面 -->
    <div>
        <self-table :data="ingAwardData"
            :loading="loading"
            :pagination.sync="pagination"
            @page-change="handleInit()"
        >
            <bk-table-column type="index" label="序号" :width="60"></bk-table-column>
            <bk-table-column label="奖项名称">
                <template slot-scope="ingAwards">
                    <award-title :award="ingAwards.row" :title="ingAwards.row['award_name']">
                        {{ ingAwards.row['award_name'] }}
                    </award-title>
                </template>
            </bk-table-column>
            <bk-table-column label="申请开始时间">
                <template slot-scope="ingAwards">
                    <span :title="ingAwards.row['start_time']" v-text="ingAwards.row['start_time']"></span>
                </template>
            </bk-table-column>
            <bk-table-column label="申请截止时间">
                <template slot-scope="ingAwards">
                    <span :title="ingAwards.row['end_time']" v-text="ingAwards.row['end_time']"></span>
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
            <bk-table-column label="奖项咨询人">
                <template slot-scope="ingAwards">
                    <span :title="ingAwards.row['award_consultant_displayname_for_display']">{{
                        ingAwards.row['award_consultant_displayname_for_display']
                    }}</span>
                </template>
            </bk-table-column>
            <bk-table-column label="操作">
                <template slot-scope="ingAwards">

                    <bk-button :text="true"
                        class="mr10"
                        @click="handleToCheckAward(ingAwards.row)">
                        奖项详情
                    </bk-button>
                    <bk-button :text="true"
                        class="mr10 ml10"
                        @click="toGetAwardApplicationDetail(ingAwards.row,true)">
                        申请详情
                    </bk-button>

                </template>
            </bk-table-column>
        </self-table>

        <slider-layout ref="application-detail"
            :header-title="curAwardInfo['award_name']"
            :width="800"
        >
            <div slot="content">
                <self-table
                    :data="ingAwardApplicationDetailData"
                    :pagination.sync="ingAwardApplicationDetailPagination"
                    :loading="loading"
                    @page-change="toGetAwardApplicationDetail(curAwardInfo)"
                >
                    <bk-table-column label="序号" type="index" :width="80"></bk-table-column>
                    <bk-table-column label="申请人">
                        <template slot-scope="ingAwardApplication">
                            <span :title="ingAwardApplication.row['application_user_for_display']"
                                v-text="ingAwardApplication.row['application_user_for_display']"
                            ></span>
                        </template>
                    </bk-table-column>
                    <bk-table-column label="申请理由">
                        <template slot-scope="ingAwardApplication">
                            <span :title="ingAwardApplication.row['application_reason']"
                                v-text="ingAwardApplication.row['application_reason'] "
                            ></span>
                        </template>
                    </bk-table-column>
                </self-table>
            </div>
        </slider-layout>

    </div>
</template>

<script>
    import { paginationTemplate, tableMixins } from '@/common/mixins/tableMixins'
    import { getAwards } from '@/api/service/award-service'
    import {
        APPLY_APPROVAL_STATE_EN_MAP,
        APPLY_APPROVAL_STATE_MAP,
        AWARD_FORM_ROUTE_PATH,
        AWARD_TYPE_DETAIL,
        AWARD_TYPE_ROUTE_KEY,
        ING_AWARD
    } from '@/constants'
    import { formatDate, formatUsernameAndDisplayName } from '@/common/util'
    import { getAwardApplication } from '@/api/service/apply-service'
    import { uuid } from '@/common/uuid'
    import AwardTitle from '@/views/award-manager/award-title'

    export default {
        name: 'ended-approval',
        components: {
            AwardTitle,
            SliderLayout: () => import('@/views/award-manager/slider-layout')
        },
        mixins: [tableMixins],
        data (self) {
            return {
                // 待审批的奖项远端数据收集，用于后续的 computed 格式化数据
                ingAwardRemoteData: [],

                // 待审批的奖项申请详情 远端数据收集

                ingAwardApplicationDetailRemoteData: [],
                curAwardInfo: {},
                ingAwardApplicationDetailPagination: { ...paginationTemplate },
                isOnlyDetail: false
            }
        },
        computed: {
            ingAwardData (self) {
                return self.ingAwardRemoteData?.map(award => {
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
                }) ?? []
            },
            ingAwardApplicationDetailData () {
                return this.ingAwardApplicationDetailRemoteData?.map((application) => {
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
                        application_reason: application['application_reason'],
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
                    this.handleGetIngAwardAwards()
                ])
            },
            /**
             * @description 获取开发中的奖项列表
             * @param {pagination.current} page
             * @param {pagination.size} size
             * */
            handleGetIngAwardAwards (page = this.pagination.current, size = this.pagination.limit) {
                if (this.loading) return
                this.loading = true
                const params = {
                    page,
                    size,
                    award_status: ING_AWARD,
                    group_id: this.$bus.curGlobalGroupId
                }
                return getAwards(params).then(response => {
                    const pendingStartAwards = response.data
                    this.pagination.count = pendingStartAwards.count ?? 0
                    this.ingAwardRemoteData = pendingStartAwards.data ?? []
                }).finally(_ => {
                    this.loading = false
                })
            },
            handleToGetDetail (awardInfo) {
                this.$router.push({
                    name: AWARD_FORM_ROUTE_PATH,
                    query: {
                        [AWARD_TYPE_ROUTE_KEY]: AWARD_TYPE_DETAIL,
                        award_id: awardInfo['award_id']
                    }
                })
            },
            // 获取数据，弹出侧栏
            toGetAwardApplicationDetail (awardInfo, isOnlyDetail) {
                this.curAwardInfo = awardInfo
                const awardId = awardInfo['award_id']
                this.isOnlyDetail = isOnlyDetail
                
                return getAwardApplication({
                    id: awardId
                }).then(response => {
                    const awardApplicationDetailData = response.data
                    this.ingAwardApplicationDetailPagination.count = awardApplicationDetailData.count ?? 0
                    this.ingAwardApplicationDetailRemoteData = awardApplicationDetailData.results ?? []
                    return Promise.resolve()
                }).then(_ => {
                    return this.toShowAwardApplicationInfo()
                })
            },
            toShowAwardApplicationInfo () {
                this.$refs['application-detail'].show()
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
