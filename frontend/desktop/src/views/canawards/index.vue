<template>
    <div class="canawards-container">
        <bk-table style="margin-top: 15px;"
            :data="tableData"
            size="small"
            :pagination="pagination"
            @page-change="handleCurrentChange($event)"
            @page-limit-change="handlePageSizeChange($event)"
            v-bkloading="{ isLoading: isLoading,title: '加载中' }"
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
                        @click="toDetail(props.row,$refs['detailDialog'])"
                        text
                    >详情
                    </bk-button>
                </template>
            </bk-table-column>
        </bk-table>
        <Detail ref="applyDialog" type="apply"></Detail>
        <Detail ref="detailDialog" type="detail"></Detail>
    </div>
</template>

<script>
    import { isDef } from '@/common/util'
    import { tableMixins } from '@/common/mixins'

    export default {
        components: {
            Detail: () => import('../detail')
        },
        mixins: [tableMixins],
        data () {
            return {
                userInfo: null,
                remoteData: [],
                awardInfo: null,
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
                if (!isDef(awardInfo.id)) {
                    return this.messageError('出错啦')
                }
                applyDialog.show({ ...awardInfo })
            },
            toDetail (awardInfo, detailDialog) {
                if (!isDef(awardInfo.id)) {
                    return this.messageError('出错啦')
                }
                detailDialog.show({ ...awardInfo })
            },
            handlePageSizeChange (limit) {
                /**
                 * 尺寸变化的时候应该让当前页面回到初始状态
                 * */
                this.pagination.current = 1
                this.pagination.limit = limit
                this.handleGetPageData(this.pagination.current, limit)
            },
            /**
             * 页面变化的时候获取可申请奖项页面数据
             * */
            handleCurrentChange (current) {
                this.pagination.current = current
                this.handleGetPageData(current, this.pagination.limit)
            },
            /**
             * 获取可申请奖项页面数据
             * */
            handleGetPageData (current, size) {
                this.isLoading = true

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
