<template>
    <div class="">
        <div>
            <bk-table style="margin-top: 15px;"
                :data="data"
                :size="size"
                :pagination="pagination"
                @page-change="handleGetPageData($event,pagination.limit)"
                @page-limit-change="handleGetPageData(pagination.current,$event)"
                v-bkloading="{ isLoading: isLoading }"
            >
                <bk-table-column label="奖项名称" prop="award_name" width="350"></bk-table-column>
                <bk-table-column label="申请时间" prop="create_time" width="350"></bk-table-column>
                <bk-table-column label="状态">
                    <template slot-scope="props">
                        <span class="status" style="background-color: rgb(86, 137, 203)" v-if="props.row.status === '待审核'">{{props.row.status}}</span>
                        <span class="status" style="background-color: rgb(80, 176, 122)" v-if="props.row.status === '已通过'">{{props.row.status}}</span>
                        <span class="status" style="background-color: rgb(234, 81, 81)" v-if="props.row.status === '不通过'">{{props.row.status}}</span>
                        <span class="status" style="background-color: rgb(255, 149, 181)" v-if="props.row.status === '草稿'">{{props.row.status}}</span>
                    </template>
                </bk-table-column>
                <bk-table-column label="操作">
                    <template slot-scope="props">
                        <bk-popconfirm
                            :title="'确认撤销申请该奖项（' + props.row['award_name'] + '）？'"
                            trigger="click"
                            content="删除操作无法撤回，请谨慎操作！"
                            @confirm="handleToDelApply(props.row)"
                        >
                            <bk-button class="mr10" v-if="props.row.status === '待审核'" theme="primary" text>撤回申请</bk-button>
                        </bk-popconfirm>
                        <bk-button class="mr10" v-if="props.row.status === '草稿'" theme="primary" text @click="handleToDelApply(props.row)">发起申请</bk-button>
                        <bk-button class="mr10" v-if="props.row.status === '草稿'" theme="primary" text @click="handleToDelApply(props.row)">编辑申请</bk-button>
                        <bk-button class="mr10" v-if="props.row.status === '已通过'" theme="primary" text @click="handleToDelApply(props.row)" :disabled="true" style="color: black;">--</bk-button>
                        <bk-button class="mr10" v-if="props.row.status === '不通过'" theme="primary" text @click="handleToDelApply(props.row)">重新申请</bk-button>
                    </template>
                </bk-table-column>
            </bk-table>
        </div>
    </div>
</template>

<script>
    export default {
        components: { },
        data () {
            return {
                userInfo: null,
                size: 'small',
                departValue: '',
                data: [
                    {
                        award_name: '全国大学生数学建模竞赛',
                        status: '待审核',
                        create_time: '2018-05-25 15:02:24'
                    }
                ],
                pagination: {
                    current: 1,
                    count: 500,
                    limit: 20
                },
                isLoading: false
            }
        },
        created () {
        },
        methods: {
            /**
             * 针对消息通知做处理
             * */
            handleMessage () {
                return this.$bkMessage()
            },
            /**
             * 查询页面数据统一接口
             * */
            handleGetPageData (current, size) {
                return this.$http.get('get_awards_list/', {
                    pageNum: current,
                    pageCount: size
                }).then(res => {
                    this.remoteData = res.data
                })
            },
            /**
             * 撤销申请
             * */
            handleToDelApply (applyId) {
                return this.$http.post('withdraw_an_application/', {
                    award_apply_record_id: applyId
                }).then(res => {
                    console.log('res', res)
                })
            }
        }
    }
</script>

<style scoped>
    @import './index.css';
</style>
