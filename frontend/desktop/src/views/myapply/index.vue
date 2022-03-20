<template>
    <div class="my-apply-container">
        <top-back></top-back>
        <div class="header-controller-panel mt15 mb20">
            <select-search
                style="width: calc(2*118px + 1*8px);font-size: 15px;"
                behavior="simplicity"
                placeholder="请选择小组"
                :value.sync="$bus.curGlobalGroupId"
                type="group"
                :id-key="'group_id'"
                :multiple="false"
                @change="handleInit()"
            ></select-search>
        </div>
        <tabs class="mt15"
            :tab-items="myApplyTabItems"
            v-model="curSelectedTable"
        >
            <template>
                <component :is="curSelectedTable" :ref="curSelectedTable"></component>
            </template>
        </tabs>
    </div>
</template>

<script>
    import { deleteRecord } from '@/api/service/award-service'
    import { getRecord } from '@/api/service/apply-service'
    import {
        APPLY_APPROVAL_STATE_EN_MAP,
        APPLY_APPROVAL_STATE_MAP
    } from '@/constants'

    export default {
        components: {
            PendingApproval: () => import('@/views/myapply/table/pending-approval'),
            IngApproval: () => import('@/views/myapply/table/ing-approval'),
            EndedApproval: () => import('@/views/myapply/table/ended-approval')
        },
        data () {
            return {
                userInfo: null,
                data: [],
                pagination: {
                    current: 1,
                    count: 0,
                    limit: 10
                },
                remoteData: [],
                isLoading: false,

                // 当前选择的表格
                curSelectedTable: 'pending-approval',
                myApplyTabItems: [
                    {
                        'tab-name': '待审批',
                        'tab-key': 'pending-approval'
                    }, {
                        'tab-name': '评审中',
                        'tab-key': 'ing-approval'
                    }, {
                        'tab-name': '已审批',
                        'tab-key': 'ended-approval'
                    }
                ]
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
        methods: {
            handleInit (curSelectedTable = this.curSelectedTable) {
                this.$refs[curSelectedTable]?.handleInit?.()
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
