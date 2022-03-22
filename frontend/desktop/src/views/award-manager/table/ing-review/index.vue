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
        <bk-table-column label="总评审轮次" :width="300">
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
                <!--                <bk-button @click="handleToGetDetail(endedApprovals.row)" :text="true">查看详情</bk-button>-->
              
                <bk-popconfirm trigger="click"
                    @confirm="handleToOverAward(endedApprovals.row)"
                    width="280">
                    <div slot="content">
                        <i class="bk-icon icon-info-circle-shape pr5 content-icon" style="color: #cc3333;"></i>
                        <span class="content-text">将会提前结束奖项,未评审的将置为未通过
                        </span>
                    </div>
                    <bk-button theme="danger"
                        class="mr20 ml20 "
                        :text="true"
                    >结束奖项</bk-button>
                </bk-popconfirm>
            </template>
        </bk-table-column>
    </self-table>
</template>

<script>
    import { getAvailableAwards, postFinishAward } from '@/api/service/award-service'
    import { tableMixins } from '@/views/mycheck/table/tableMixins'
    import { AWARD_APPLICATION_DETAILS_ROUTE_PATH, ING_REVIEW } from '@/constants'

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
                console.log(awardInfo)
                this.$router.push({
                    name: AWARD_APPLICATION_DETAILS_ROUTE_PATH,
                    query: {
                        award_id: awardInfo['award_id'],
                        group_id: this.$bus.curGlobalGroupId
                    }
                })
            },
            handleToOverAward (awardInfo) {
                return postFinishAward(awardInfo['award_id']).then(response => {
                    this.handleInit()
                    this.messageSuccess('已成功终止奖项评审')
                })
            }

        }

    }
</script>
