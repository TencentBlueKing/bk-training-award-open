<template>
    <self-table :data="ingReviewData"
        :loading="loading"
        :pagination.sync="pagination"
        @page-change="handleInit()"
    >
        <bk-table-column type="index" label="序号" :width="60"></bk-table-column>
        <bk-table-column label="奖项名称">
            <template slot-scope="ingAwards">
                <span :title="ingAwards.row['award_name']" v-text="ingAwards.row['award_name']"></span>
            </template>
        </bk-table-column>
        <bk-table-column label="奖项开始时间">
            <template slot-scope="ingAwards">
                <span :title="ingAwards.row['start_time']" v-text="ingAwards.row['start_time']"></span>
            </template>
        </bk-table-column>
        <bk-table-column label="奖项截止时间">
            <template slot-scope="ingAwards">
                <span :title="ingAwards.row['end_time']" v-text="ingAwards.row['end_time']"></span>
            </template>
        </bk-table-column>
        <bk-table-column label="奖项咨询人">
            <template slot-scope="ingAwards">
                <span :title="ingAwards.row['award_consultant_displayname_for_display']">{{ ingAwards.row['award_consultant_displayname_for_display'] }}</span>
            </template>
        </bk-table-column>
        <bk-table-column label="评审轮次" :width="300">
            <template slot-scope="endedApprovals">
                <bk-select
                    :value="0"
                    :clearable="false"
                >
                    <bk-option v-for="(item,index) in endedApprovals.row['award_reviewers']"
                        :key="item"
                        :name="'第' + (index + 1) + '轮:' + item.join(',')"
                        :id="index"
                        :title="'第' + (index + 1) + '轮:' + item.join(',')"
                    ></bk-option>
                </bk-select>
            </template>
        </bk-table-column>
        <bk-table-column label="操作">
            <template slot-scope="endedApprovals">
                <bk-button @click="handleToGetDetail(endedApprovals.row)" :text="true">查看详情</bk-button>
            </template>
        </bk-table-column>
    </self-table>
</template>

<script>
    import { getAvailableAwards } from '@/api/service/award-service'
    import { tableMixins } from '@/views/mycheck/table/tableMixins'
    import { DETAIL_ROUTE_PATH, ING_REVIEW } from '@/constants'

    export default {
        name: 'ended-approval',
        mixins: [tableMixins],
        data () {
            return {
                ingReviewRemoteData: []
            }
        },
        computed: {
            ingReviewData (self) {
                return self.ingReviewRemoteData?.map(award => {
                    return {
                        award_id: award['id'],
                        award_name: award['award_name'],
                        award_description: award['award_description'],
                        award_department_fullname: award['award_department_fullname'],
                        award_department_id: award['award_department_id'],
                        award_reviewers: award['award_reviewers'],
                        award_consultant: award['award_consultant'],
                        award_consultant_displayname: award['award_consultant_displayname'],
                        award_consultant_displayname_for_display: award['award_consultant'] + '（' + award['award_consultant_displayname'] + '）',
                        award_demand: award['award_demand'],
                        start_time: award['start_time'],
                        end_time: award['end_time'],
                        approval_state: award['approval_state']
                    }
                })
            }
        },
        mounted () {
            this.handleInit()
        },
        methods: {
            handleInit () {
                Promise.all([this.handleGetIngReview()])
            },
          
            handleGetIngReview (page = this.pagination.current, size = this.pagination.size) {
                if (this.loading) return
                this.loading = true
                const params = {
                    page,
                    size,
                    award_status: ING_REVIEW,
                    group_id: this.$bus.curGlobalGroupId
                }
                return getAvailableAwards(params).then(response => {
                    const pendingStartAwards = response.data
                    this.pagination.count = pendingStartAwards.count
                    this.ingReviewRemoteData = pendingStartAwards.data
                }).finally(_ => {
                    this.loading = false
                })
            },
            handleToGetDetail (awardInfo) {
                this.$router.push({
                    name: DETAIL_ROUTE_PATH,
                    query: {
                        type: 'detail',
                        award_id: awardInfo['award_id']
                    }
                })
            }

        }

    }
</script>
