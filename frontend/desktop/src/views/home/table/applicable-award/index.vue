<template>
    <!--    可申请奖项表格-->
    <self-table :data="applicationableAwardList"
        :pagination.sync="pagination"
        :loading="loading"
        @page-change="handleGetPageData"
    >
        <bk-table-column label="序列" width="60"></bk-table-column>
        <bk-table-column label="奖项名称"></bk-table-column>
        <bk-table-column label="所属小组"></bk-table-column>
        <bk-table-column label="截止申请时间"></bk-table-column>
        <bk-table-column label="操作">
            <template slot-scope="groups">
                <bk-button :text="true" @click="toApply(groups.row)">
                    立即申请
                </bk-button>
            </template>
        </bk-table-column>
    </self-table>
</template>

<script>
    import { DETAIL_ROUTE_PATH } from '@/constants'
    import { getAwards } from '@/api/service/award-service'

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
                return self.applicationableAwardRemoteList
            }
        },
        created () {
            this.handleInit()
        },
        methods: {
            toApply (group) {
                this.$router.push({
                    name: DETAIL_ROUTE_PATH,
                    query: {
                        type: 'apply'
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
                    this.pagination.count = data.count
                    this.groupApprovalRemoteData = data.result
                }).finally(_ => {
                    this.loading = false
                })
            }

        }
    }
</script>
