<template>
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

    </self-table>
</template>

<script>
    import { tableMixins } from '@/views/mycheck/table/tableMixins'
    import { ENDED_REVIEW } from '@/constants'
    import { getAwards } from '@/api/service/award-service'
    export default {
        name: 'ended-review',
        mixins: [tableMixins],
        data () {
            return {
                endedReviewRemoteData: [],
                loading: false
            }
        },
        computed: {
            endedReviewData (self) {
                return self.endedReviewRemoteData.map(award => {
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
                }) ?? []
            }
        },
        mounted () {
            this.handleInit()
        },
        methods: {
            handleInit () {
                Promise.all([
                    this.handleGetEndedAwardAwards()
                ])
            },
            handleGetEndedAwardAwards (page = this.pagination.current, size = this.pagination.size) {
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
                    this.pagination.count = endedReviewAwards.count
                    this.endedReviewRemoteData = endedReviewAwards.data
                }).finally(_ => {
                    this.loading = false
                })
            }
        }

    }
</script>
