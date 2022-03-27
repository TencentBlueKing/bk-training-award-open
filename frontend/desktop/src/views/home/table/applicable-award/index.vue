<template>
    <!--    可申请奖项表格-->
    <self-table :data="applicationableAwardList"
        :pagination.sync="pagination"
        :loading="loading"
        @page-change="handleInit"
    >
        <bk-table-column label="序列" width="60" type="index"></bk-table-column>
        <bk-table-column label="奖项名称" prop="award_name">
            <template slot-scope="awards">
                <span :title="awards['row']['award_name']">
                    {{ awards.row['award_name']}}
                </span>
            </template>
        </bk-table-column>
        <bk-table-column label="所属小组">
            <template slot-scope="awards">
                <span :title="awards['row']['award_department_fullname']">
                    {{ awards.row['award_department_fullname']}}
                </span>
            </template>
        </bk-table-column>
        <bk-table-column label="申请截止时间" :width="200">
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
    import { DETAIL_APPLY, DETAIL_ROUTE_PATH, DETAIL_TYPE_KEYNAME, ING_AWARD } from '@/constants'
    import { getAvailableAwards } from '@/api/service/award-service'
    import { formatDate } from '@/common/util'

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
                        start_time: formatDate(item['start_time']),
                        end_time: formatDate(item['end_time']),
                        approval_state: item['approval_state']
                    }
                })
            }
        },
        created () {
            this.handleInit()
        },
        methods: {
            handleInit () {
                this.handleGetPageData()
            },
            handleGetPageData (page = this.pagination.current, size = this.pagination.limit) {
                if (this.loading) {
                    return
                }
                this.loading = true
                return getAvailableAwards({
                    page,
                    size,
                    award_status: ING_AWARD
                }).then(({ data }) => {
                    this.pagination.count = data?.count
                    this.applicationableAwardRemoteList = data?.results
                }).finally(_ => {
                    this.loading = false
                })
            },
            /**
             * 跳转申请页面
             * @param award
             * */
            toApply (award) {
                this.$router.push({
                    name: DETAIL_ROUTE_PATH,
                    query: {
                        [DETAIL_TYPE_KEYNAME]: DETAIL_APPLY,
                        award_id: award['id'],
                        group_id: award['award_department_id']
                    }
                })
            }

        }
    }
</script>
