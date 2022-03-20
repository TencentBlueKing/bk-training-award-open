<template>
    <self-table :data="endedReviewData"
        :loading="loading"
        :pagination.sync="pagination"
        @page-change="handleInit()"
    >
        <bk-table-column type="index" label="序号" width="60"></bk-table-column>
        <bk-table-column label="奖项名称" prop="ip"></bk-table-column>
        <bk-table-column label="奖项开始时间" prop="source"></bk-table-column>
        <bk-table-column label="奖项截止时间" prop="status"></bk-table-column>
        <bk-table-column label="奖项咨询人" prop="create_time"></bk-table-column>
        <bk-table-column label="评语">
            <template slot-scope="endedApprovals">
                <bk-select :readonly="true">
                    <bk-option>{{endedApprovals.row}}</bk-option>
                </bk-select>
            </template>
        </bk-table-column>
        <bk-table-column label="操作">
            <template slot-scope="endedApprovals">
                <bk-button @click="handleGetDetail(endedApprovals.row)" :text="true"></bk-button>
            </template>
        </bk-table-column>
    </self-table>
</template>

<script>
    import { tableMixins } from '@/views/mycheck/table/tableMixins'
    import { ENDED_REVIEW } from '@/constants'
    import { getAvailableAwards } from '@/api/service/award-service'
    export default {
        name: 'ended-review',
        mixins: [tableMixins],
        data () {
            return {
                endedReviewRemoteData: [{}],
                loading: false
            }
        },
        computed: {
            endedReviewData (self) {
                return self.endedReviewRemoteData
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
                return getAvailableAwards(params).then(response => {
                    const endedReviewAwards = response.data
                    this.pagination.count = endedReviewAwards.count
                    this.endedReviewRemoteData = endedReviewAwards.data
                }).finally(_ => {
                    this.loading = false
                })
            },
            handleGetDetail () {
            }

        }

    }
</script>
