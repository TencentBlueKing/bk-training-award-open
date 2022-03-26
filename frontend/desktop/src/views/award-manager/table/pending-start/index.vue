<template>
    <!-- 待开始奖项页面 -->
    <div>
        <!-- 数据表格开始 -->
        <self-table :data="pendingStartData"
            :loading="loading"
            :pagination.sync="pagination"
            @page-change="handleInit()"
        >
            <bk-table-column type="index" label="序号" :width="60"></bk-table-column>
            <bk-table-column label="奖项名称">
                <template slot-scope="pendingAwards">
                    <span :title="pendingAwards.row['award_name']" v-text="pendingAwards.row['award_name']"></span>
                </template>
            </bk-table-column>
            <bk-table-column label="申请开始时间">
                <template slot-scope="pendingAwards">
                    <span :title="pendingAwards.row['start_time']" v-text="pendingAwards.row['start_time']"></span>
                </template>
            </bk-table-column>
            <bk-table-column label="申请截止时间">
                <template slot-scope="pendingAwards">
                    <span :title="pendingAwards.row['end_time']" v-text="pendingAwards.row['end_time']"></span>
                </template>
            </bk-table-column>
            <bk-table-column label="奖项顾问">
                <template slot-scope="pendingAwards">
                    <span :title="pendingAwards.row['award_consultant_displayname_for_display']">{{
                        pendingAwards.row['award_consultant_displayname_for_display']
                    }}</span>
                </template>
            </bk-table-column>
            <bk-table-column label="评审轮次" :width="300">
                <template slot-scope="pendingAwards">
                    <bk-select
                        :value="0"
                        :clearable="false"
                    >
                        <bk-option v-for="(item,index) in pendingAwards.row['award_reviewers_for_display']"
                            :key="item['uuid']"
                            :name="item['description']"
                            :id="index"
                            :title="item['description']"
                        ></bk-option>
                    </bk-select>
                </template>
            </bk-table-column>
            <bk-table-column label="操作">
                <template slot-scope="endedApprovals">
                    <bk-button @click="handleToEditAward(endedApprovals.row)" :text="true">编辑奖项</bk-button>
                </template>
            </bk-table-column>
        </self-table>
    </div>
</template>

<script>
    import { tableMixins } from '@/common/mixins/tableMixins'
    import { getAwards } from '@/api/service/award-service'
    import {
        APPLY_APPROVAL_STATE_EN_MAP, APPLY_APPROVAL_STATE_MAP,
        AWARD_FORM_ROUTE_PATH,
        AWARD_TYPE_EDIT,
        AWARD_TYPE_ROUTE_KEY,
        PENDING_START
    } from '@/constants'
    import { formatDate, formatUsernameAndDisplayName } from '@/common/util'
    import { uuid } from '@/common/uuid'
    export default {
        name: 'pending-start',
        mixins: [tableMixins],
        data () {
            return {
                // 开始的奖项远端数据收集，用于后续的 computed 格式化数据
                pendingStartRemoteData: []
            }
        },
        computed: {
            pendingStartData (self) {
                return self.pendingStartRemoteData?.map((award) => {
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
            }
        },
        created () {
            this.handleInit()
        },
        methods: {
            handleInit () {
                Promise.all([
                    this.handleGetPendingStartAwards()
                ])
            },
            handleGetPendingStartAwards (page = this.pagination.current, size = this.pagination.limit) {
                if (this.loading) return
                this.loading = true
                const params = {
                    page,
                    size,
                    award_status: PENDING_START,
                    group_id: this.$bus.curGlobalGroupId
                }
                return getAwards(params).then(response => {
                    const pendingStartAwards = response.data
                    this.pagination.count = pendingStartAwards.count
                    this.pendingStartRemoteData = pendingStartAwards.data
                }).finally(_ => {
                    this.loading = false
                })
            },
            handleToEditAward (awardInfo) {
                this.$router.push({
                    name: AWARD_FORM_ROUTE_PATH,
                    query: {
                        [AWARD_TYPE_ROUTE_KEY]: AWARD_TYPE_EDIT,
                        award_id: awardInfo['award_id']
                    }
                })
            }
        }

    }
</script>
