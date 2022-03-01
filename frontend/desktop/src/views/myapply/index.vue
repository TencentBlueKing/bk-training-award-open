<template>
    <div class="my-apply-container">
        <bk-table style="margin-top: 15px;"
            :data="tableData"
            :pagination="pagination"
            @page-change="handlePageChange($event)"
            @page-limit-change="handleLimitChange($event)"
            v-bkloading="{ isLoading: isLoading }"
        >
            <bk-table-column label="序号"
                type="index"
                width="80"
            ></bk-table-column>
            <bk-table-column label="奖项名称" prop="award_name"></bk-table-column>
            <bk-table-column label="申请时间" prop="application_time"></bk-table-column>
            <bk-table-column label="申请原因"
                prop="application_reason"
            >
                <template slot-scope="props">
                    <span v-bk-overflow-tips="{ content: props.row['application_reason'] }">
                        {{ props.row['application_reason'] }}
                    </span>
                </template>
            </bk-table-column>
            <bk-table-column label="状态"
                :align="'center'"
                :header-align="'center'"
            >
                <template slot-scope="props">
                    <span :class="['status',props.row.approval_state_en]">
                        {{ props.row.approval_state_cn }}
                    </span>
                </template>
            </bk-table-column>
            <bk-table-column label="操作"
                fixed="right"
            >
                <template slot-scope="props">
                    <bk-popconfirm
                        :title="'确认撤销申请该奖项（' + props.row['award_name'] + '）？'"
                        trigger="click"
                        content="删除操作无法撤回，请谨慎操作！"
                        @confirm="approval_status_button_config[props.row['approval_state']]['button-func'](props.row)"
                        v-if="approval_status_button_config[props.row['approval_state']]['button-need-pop-confirm']"
                    >
                        <bk-button
                            class="mr10"
                            theme="primary"
                            :text="true"
                        >
                            {{ config['approval_status_button'][props.row['approval_state']]['button-title'] }}
                        </bk-button>
                    </bk-popconfirm>
                    <bk-button v-else class="mr10"
                        theme="primary"
                        :text="true"
                        @click="approval_status_button_config[props.row['approval_state']]['button-func'](props.row)"
                        :disabled="approval_status_button_config[props.row['approval_state']]['disabled']"
                    >
                        {{ approval_status_button_config[props.row['approval_state']]['button-title'] }}
                    </bk-button>
                </template>
            </bk-table-column>
        </bk-table>
    </div>
</template>

<script>
    import { deleteRecord } from '@/api/service/award-service'
    import { getRecord } from '@/api/service/apply-service'
    import {
        APPLY_APPROVAL_STATE_EN_MAP,
        APPLY_APPROVAL_STATE_MAP,
        DRAFT,
        REVIEW_NOT_PASSED,
        REVIEW_PASSED,
        REVIEW_PENDING
    } from '@/constants'

    export default {
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
                remoteData: [],
                isLoading: false,
                config: {
                    approval_status_button: {
                        [REVIEW_PENDING]: {
                            'button-title': '撤回申请',
                            'button-func': this.handleToDelApply,
                            'button-need-pop-confirm': true
                        },
                        [REVIEW_PASSED]: {
                            'button-title': '——',
                            'disabled': true
                        },
                        [REVIEW_NOT_PASSED]: {
                            'button-title': '重新申请',
                            'button-func': this.handleToApply
                        },
                        [DRAFT]: {
                            'button-title': '发起申请',
                            'button-func': this.handleToApply
                        }
                    }
                }
            }
        },
        computed: {
            tableData: {
                get (self) {
                    return self.remoteData?.map?.(rawData => {
                        return {
                            ...rawData['award_info'],
                            ...rawData,
                            approval_state_cn: APPLY_APPROVAL_STATE_MAP[rawData['approval_state']],
                            approval_state_en: APPLY_APPROVAL_STATE_EN_MAP[rawData['approval_state']]
                        }
                    }) ?? []
                }
            },
            approval_status_button_config (self) {
                return self.config['approval_status_button']
            }
        },
        created () {
            this.handleGetPageData()
        },
        methods: {
            handleInit () {
                this.handleGetPageData()
            },

            handlePageChange (current) {
                this.pagination.current = current
                return this.handleGetPageData()
            },
            handleLimitChange (limit) {
                this.pagination.limit = limit
                this.pagination.current = 1
                return this.handleGetPageData()
            },
            /**
             * 查询页面数据统一接口
             * */
            handleGetPageData (current = this.pagination.current, size = this.pagination.limit) {
                this.isLoading = true
                return getRecord(current, size).then(res => {
                    this.remoteData = res.data['data']
                }).finally(_ => {
                    this.isLoading = false
                })
            },
            /**
             * 撤销申请
             * */
            handleToDelApply ({ id }) {
                return deleteRecord(id).then(res => {
                    this.messageSuccess('撤销成功')
                    this.handleGetPageData()
                })
            },
            /**
             * 跳转草稿页面，重新申请
             * */
            handleToDetail () {

            },
            /**
             * 重新发起申请
             * */
            handleToApply (curInfo) {
                this.$router.push({
                    name: 'detail',
                    params: {
                      ...curInfo,
                      type: 'apply'
                    }
                })
            }
        }
    }
</script>

<style lang="postcss" scoped>
@import './index.css';
</style>
