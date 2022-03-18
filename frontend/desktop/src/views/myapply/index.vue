<template>
    <div class="my-apply-container">
        <top-back></top-back>
        <div class="header-controller-panel mt15 mb20">
            <select-search
                style="width: var(--xs)"
                behavior="simplicity"
            ></select-search>
        </div>
        <tabs class="mt15"
            :tab-items="[{
                'tab-name': '待审批',
                'tab-key': 'pending-approval'
            },{
                'tab-name': '评审中',
                'tab-key': 'ing-approval'
            },{
                'tab-name': '已审批',
                'tab-key': 'ended-approval'
            }
            ]"
            v-model="curSelectedTable"
        >
            <template>

            </template>
        </tabs>
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
    import SelectSearch from '@/components/select-search'

    export default {
        components: { SelectSearch },
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
                            'is-review_pending': true
                        },
                        [REVIEW_PASSED]: {
                            'button-title': '--',
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
                },

                // 当前选择的表格
                curSelectedTable: 'pending-approval'
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

.my-apply-container {
  $size: 2;
  --xs: calc($size * 118px + ($size - 1) * 8px);
}
</style>
