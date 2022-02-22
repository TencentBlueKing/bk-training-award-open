<template>
    <div class="my-apply-container">
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
                        @confirm="handleToDelApply(props.row['id'])"
                    >
                        <bk-button class="mr10" v-if="props.row.approval_state === 0" theme="primary" text>撤回申请</bk-button>
                    </bk-popconfirm>
                    <bk-button class="mr10" v-if="props.row.approval_state === 3" theme="primary" text @click="handleToDelApply(props.row)">发起申请</bk-button>
                    <bk-button class="mr10" v-if="props.row.approval_state === 3" theme="primary" text @click="handleToDelApply(props.row)">编辑申请</bk-button>
                    <bk-button class="mr10" v-if="props.row.approval_state === 1"
                        :disabled="true"
                        text
                        ext-cls="text-dark"
                    >--</bk-button>
                    <bk-button class="mr10" v-show="props.row.status === 2" theme="primary" text @click="handleToDelApply(props.row)">重新申请</bk-button>
                </template>
            </bk-table-column>
        </bk-table>
    </div>
</template>

<script>
    import { deleteRecord } from '@/api/service/award-service'
    import { getRecord } from '@/api/service/apply-service'

    export default {
        components: { },
        data () {
            return {
                userInfo: null,
                size: 'small',
                departValue: '',
                data: [],
                pagination: {
                    current: 1,
                    count: 0,
                    limit: 10
                },
                isLoading: false
            }
        },
        created () {
            this.handleGetPageData()
        },
        methods: {
            /**
             * 查询页面数据统一接口
             * */
            handleGetPageData (current, size) {
                this.isLoading = true
                return getRecord(current, size).then(res => {
                    console.log(res)
                }).finally(_ => {
                    this.isLoading = false
                })
            },
            /**
             * 撤销申请
             * */
            handleToDelApply (applyId) {
                return deleteRecord(applyId).then(res => {
                    this.messageSuccess('删除成功')
                })
            }
        }
    }
</script>

<style scoped>
    @import './index.css';
</style>
