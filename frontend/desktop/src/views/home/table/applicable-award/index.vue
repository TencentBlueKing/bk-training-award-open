<template>
    <!--    可申请奖项表格-->
    <self-table :data="applicationableAwardList"
        :pagination.sync="pagination"
        :loading="loading"
        :height="300"
        @page-change="handleGetPageData"
    >
        <bk-table-column label="序列" width="60" type="index"></bk-table-column>
        <bk-table-column label="奖项名称" prop="award_name"></bk-table-column>
        <bk-table-column label="所属小组">
            <template slot-scope="awards">
                <bk-tag theme="success" :title="awards['row']['award_department_fullname']">
                    {{ awards.row['award_department_fullname']}}
                </bk-tag>
            </template>
        </bk-table-column>
        <bk-table-column label="截止申请时间" :width="200">
            <template slot-scope="awards">
                <span :title="awards['row']['end_time']">
                    {{ awards['row']['end_time']}}
                </span>
            </template>
        </bk-table-column>
        <bk-table-column label="操作">
            <template slot-scope="awards">
                <bk-button :text="true" @click="toApply(awards.row)">
                    立即申请
                </bk-button>
            </template>
        </bk-table-column>
    </self-table>
</template>

<script>
    import { DETAIL_ROUTE_PATH } from '@/constants'
    import { getAwards } from '@/api/service/award-service'
    import moment from 'moment'

    export default {
        name: 'applicable-award',
        data () {
            return {
                applicationableAwardRemoteList: [],
                loading: false,
                pagination: {
                    current: 1,
                    count: 0,
                    limit: 10
                }
            }
        },
        computed: {
            applicationableAwardList (self) {
                return self.applicationableAwardRemoteList?.map(item => {
                    return {
                        id: item['id'],
                        award_name: item['award_name'],
                        award_description: item['award_description'],
                        award_department_fullname: item['award_department_fullname'],
                        award_department_id: item['award_department_id'],
                        award_reviewers: item['award_reviewers'],
                        award_consultant: item['award_consultant'],
                        award_consultant_displayname: item['award_consultant_displayname'],
                        award_demand: item['award_demand'],
                        start_time: item['start_time'],
                        end_time: moment(item['end_time']).format('YYYY-MM-DD hh:mm'),
                        approval_state: item['approval_state']
                    }
                })
            }
        },
        created () {
            this.handleInit()
        },
        methods: {
            toApply (award) {
                this.$router.push({
                    name: DETAIL_ROUTE_PATH,
                    query: {
                        type: 'apply',
                        award_id: award['id']
                    }
                })
            },
            handleInit () {
                this.handleGetPageData(this.pagination)
            },
            handleGetPageData (config) {
                const { current: page, limit: size } = config
                if (this.loading) {
                    return
                }
                this.loading = true
              
                return getAwards({ page, size }).then(({ data }) => {
                    console.log(data)
                    this.pagination.count = data?.count
                    this.applicationableAwardRemoteList = data?.data
                }).finally(_ => {
                    this.loading = false
                })
            }

        }
    }
</script>
