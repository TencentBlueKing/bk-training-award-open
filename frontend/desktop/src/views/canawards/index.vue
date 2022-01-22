<template>
    <div class="example1-wrapper">
        <div>
            <bk-table style="margin-top: 15px;"
                :data="tableData"
                size="small"
                :pagination="pagination"
                @page-change="handleCurrentChange($event)"
                @page-limit-change="handlePageSizeChange($event)"
                v-bkloading="{ isLoading: isLoading }"
            >
                <bk-table-column label="奖项名称" prop="award_name"></bk-table-column>
                <bk-table-column label="奖项级别" prop="award_level"></bk-table-column>
                <bk-table-column label="接口人(可咨询奖项相关信息)" prop="award_description"></bk-table-column>
                <bk-table-column label="开始申请时间" prop="start_time"></bk-table-column>
                <bk-table-column label="截止申请时间" prop="end_time"></bk-table-column>
                <bk-table-column label="操作" width="150">
                    <template slot-scope="props">
                        <bk-button class="mr10" theme="primary"
                            :disabled="['创建中'].includes(props.row.approval_state)"
                            @click="toApply(props.row,$refs['applyDialog'])"
                            text
                        >申请
                        </bk-button>
                        <bk-button class="mr10"
                            theme="primary"
                            @click="getDetail(props.row,$refs['detailDialog'])"
                            text
                        >详情
                        </bk-button>
                    </template>
                </bk-table-column>
            </bk-table>
        </div>
        <Detail ref="applyDialog" type="apply"></Detail>
        <Detail ref="detailDialog" type="detail"></Detail>
    </div>
</template>

<script>
    import Detail from '../detail'
    export default {
        components: { Detail },
        data () {
            return {
                userInfo: null,
                remoteData: [],
                pagination: {
                    current: 1,
                    count: 0,
                    limit: 1
                },
                awardInfo: null,
                slideType: 'detail',
                isLoading: false
            }
        },
        computed: {
            tableData () {
                const remoteData = this.remoteData
                if (!remoteData.map) {
                    return []
                }
                return remoteData.map((rowData) => {
                    return {
                        id: rowData['id'],
                        award_name: rowData['award_name'],
                        award_level: rowData['award_level'],
                        award_description: rowData['award_description'],
                        award_consultant: rowData['award_consultant'],
                        award_image: rowData['award_image'],
                        create_time: rowData['create_time'],
                        start_time: rowData['start_time'],
                        end_time: rowData['end_time'],
                        approval_state: rowData['approval_state']
                    }
                })
            }
        },
        created () {
            this.handleInit()
        },
        methods: {
            handleInit () {
                this.handleGetPageData(this.pagination.current, this.pagination.limit)
            },
            toApply (awardInfo, applyDialog) {
                applyDialog.show({ ...awardInfo })
            },
            getDetail (awardInfo, detailDialog) {
                detailDialog.show({ ...awardInfo })
            },
            handlePageSizeChange (limit) {
                this.pagination.limit = limit
                this.pagination.current = 1
                this.handleGetPageData(this.pagination.current, limit)
            },
            handleCurrentChange (current) {
                this.pagination.current = current
                this.handleGetPageData(current, this.pagination.limit)
            },
            /**
             * 获取可申请奖项页面数据
             * */
            handleGetPageData (current, size) {
                this.isLoading = true

                this.remoteData = [{}].fill(1)
                return this.$http.get('get_awards_list/', {
                    params: {
                        page_num: current,
                        page_size: size
                    }
                }).then(res => {
                    this.remoteData = res.data['awards']
                    this.pagination.count = res.data['total_count']
                }).finally(_ => {
                    this.isLoading = false
                })
            }
        }
    }
</script>

<style scoped>
    @import './index.css';
</style>
