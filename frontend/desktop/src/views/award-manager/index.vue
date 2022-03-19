<template>
    <div class="award-container">
        <top-back></top-back>
        <!-- 表格按钮区域 -->

        <div class="header-controller-panel mt20 mb20">
            <select-search behavior="simplicity"
                style="width: calc(2*118px + 8px)"
            ></select-search>
        </div>
        <tabs class="mt15" :tab-items="[
            {
                'tab-name': '待开始',
                'tab-key': 'pending-start'
            },
            {
                'tab-name': '已开始',
                'tab-key': 'ing-award'
            },
            {
                'tab-name': '评审中',
                'tab-key': 'ing-review'
            },
            {
                'tab-name': '已结束',
                'tab-key': 'ended-review'
            }
        ]">
            <bk-table class="mt15"
                :data="tableData"
                :size="'small'"
                :pagination="pagination"
                @page-change="handleCurrentChange($event)"
                @page-limit-change="handlePageSizeChange($event)"
                @selection-change="handleSetSelectData"
            >
                <bk-table-column type="selection" width="60"></bk-table-column>
                <bk-table-column type="index"
                    label="序号"
                    width="60"
                ></bk-table-column>
                <bk-table-column v-for="(rowLabel,rowProp) in tableSettings"
                    :key="rowProp"
                    :label="rowLabel"
                >
                    <template slot-scope="prop">
                        <span>{{ prop.row[rowProp] }}</span>
                    </template>
                </bk-table-column>
                <bk-table-column label="操作">
                    <template slot-scope="props">
                        <div v-show="props.row['approval_state'] !== config['award_status']['not_apply']">
                            <bk-button theme="primary"
                                :text="true"
                                @click="toEditRow(props.row)"
                            >编辑
                            </bk-button>
                            <bk-popconfirm
                                :title="'确认删除该奖项（' + props.row.awardName + '）？'"
                                trigger="click"
                                content="删除操作无法撤回，请谨慎操作！"
                                @confirm="confirmDelAward(props.row)"
                            >
                                <bk-button theme="primary" text>删除</bk-button>
                            </bk-popconfirm>
                            <bk-button theme="primary" text @click="toGetDetail(props.row,$refs['GetDetailDialog'])">详情</bk-button>
                        </div>
                        <div v-show="props.row['approval_state'] === config['award_status']['not_apply']">
                            <bk-button theme="primary" text @click="toEndAward(props.row,$refs['EndAwardForm'])">结束</bk-button>
                        </div>
                    </template>
                </bk-table-column>
            </bk-table>
        </tabs>
        <!-- /表格按钮区域 -->

        <!-- 弹出区域 -->
        <DialogArea ref="BatchCloneForm" title="批量克隆">
            <BatchCloneForm slot="custom"
                :form-data="selectData"
                :total-data="tableData"
            ></BatchCloneForm>
        </DialogArea>
        <DialogArea ref="BatchSendEmailForm" title="批量发送邮件">
            <BatchSendEmailForm slot="custom"
                :select-data="selectData"
            ></BatchSendEmailForm>
        </DialogArea>
        <DialogArea ref="NotificationForm" title="编辑公示">
            <NotificationForm slot="custom"
                :select-data="selectData"
            ></NotificationForm>
        </DialogArea>
        <DialogArea ref="EndAwardForm" title="结束奖项">
            <EndAwardForm slot="custom"></EndAwardForm>
        </DialogArea>
    <!-- /弹出区域 -->
    </div>
</template>
<script>
    import { tableMixins } from '@/common/mixins'
    import { APPLYED, AWARD_APPROVAL_STATE_MAP, ENDED, NOT_APPLY } from '@/constants'
    import { deleteAward, getAwards } from '@/api/service/award-service'
    import { bus } from '@/store/bus'
    import moment from 'moment'
    import SelectSearch from '@/components/select-search'

    export default {
        name: 'award-manager',
        components: {
            SelectSearch,
            DialogArea: () => import('./components/DialogArea'),
            BatchCloneForm: () => import('./components/DialogArea/BatchCloneForm'),
            BatchSendEmailForm: () => import('./components/DialogArea/BatchSendEmailForm'),
            NotificationForm: () => import('./components/DialogArea/NotificationForm'),
            EndAwardForm: () => import('./components/DialogArea/EndAwardForm')
            // FilterSvg: () => import('./components/Svg/FilterSvg')
        },
        mixins: [
            /**
             * 分页器的混入
             * */
            tableMixins
        ],
        data () {
            return {
                // S 控制信息区
                // loading 状态
                loading: {
                    newAwardFormLoading: false
                },
                config: {
                    award_status: {
                        'ended': ENDED,
                        'not_apply': NOT_APPLY,
                        'applied': APPLYED

                    }
                },

                // 是否展示高级筛选区域
                isFilter: '',
                // 表格基本设置
                tableSettings: {
                    awardName: '奖项名称',
                    awardStatus: '状态',
                    startApplyTime: '开始申请时间',
                    endApplyTime: '截止申请时间'
                },
                isDialogShow: false,
                // E 控制信息区

                // S 用于接收远程数据
                remoteData: [],
                // E 用于接收远程数据
                // S 表单
                formData: {},
                // 临时放置作为克隆的数据
                selectData: [],
                // 临时放置用于查看或者编辑 需要异步获取
                checkData: {}
                // E 表单
            }
        },
        computed: {
            tableData (self) {
                return self.remoteData?.map?.(rawData => {
                    let timeApproval
                    const startTime = moment(rawData['start_time'])
                    const endTime = moment(rawData['end_time'])
                    const curTime = moment()
                    if (startTime.diff(curTime) >= 0) {
                        timeApproval = NOT_APPLY
                    } else if (endTime.diff(curTime) <= 0) {
                        timeApproval = ENDED
                    } else {
                        timeApproval = APPLYED
                    }
                    return {
                        ...rawData,
                        awardName: rawData['award_name'],
                        approval_state: timeApproval,
                        awardStatus: AWARD_APPROVAL_STATE_MAP[timeApproval],
                        startApplyTime: rawData['start_time'],
                        endApplyTime: rawData['end_time']
                    }
                }) ?? []
            }
        },
        created () {
            this.handleInit()
        },
        mounted () {
            bus.$on('set-award-manager-init', () => {
                this.handleInit()
            })
        },
        methods: {
            handleInit () {
                this.handleGetPageData()
                // 添加监听事件
            },
            // S 弹框控制区域
            // 新增
            toAddNewAward () {
                this.$router.push({
                    name: 'award-form',
                    query: {
                        type: 'new'
                    }
                })
            },
            // 批量克隆
            toBatchClone (batchCloneDialog, selectData) {
                if (!selectData.length) {
                    this.messageError('请先选择奖项')
                    return null
                }
                batchCloneDialog.show()
            },
            // 批量发送邮件
            toSendEmail (sendEmailDialog, selectData) {
                if (!selectData.length) {
                    this.messageError('请先选择奖项')
                    return null
                }
                sendEmailDialog.show()
            },
            // 批量导出
            toBatchExport (batchExportDialog) {
            },
            // 展示公告弹框
            toSendNotification (sendNotificationDialog) {
                sendNotificationDialog.show()
            },
            // 展示高级筛选
            // toShowFilterPanel () {
            //     this.isFilter = this.isFilter ? '' : 'filter-panel'
            // },
            // 编辑当前行
            toEditRow (rowData) {
                return this.$router.push({
                    name: 'award-form',
                    query: {
                        type: 'edit'
                    },
                    params: {
                      ...rowData
                    }
                })
            },
            // 获取单行详情
            toGetDetail (rowData) {
                return this.$router.push({
                    name: 'award-form',
                    query: {
                        type: 'detail'
                    },
                    params: {
                        ...rowData
                    }
                })
            },
            // 弹出结束奖项
            toEndAward (rawData, EndAwardForm) {
                EndAwardForm.show()
            },
            // E 弹框控制区域
            confirmDelAward (rawData) {
                console.log(rawData)
                return deleteAward({ awardId: rawData['id'] }).then(_ => {
                    this.handleInit()
                    this.messageSuccess('删除成功')
                })
            },
            /**
             * 获取表单信息并提交
             * */
            handleSetSelectData (selectData) {
                this.selectData = [...selectData]
            },

            /**
             * 获取表格信息
             * */
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
            handleGetPageData (current = this.pagination.current, size = this.pagination.limit) {
                this.isLoading = true

                return getAwards(current, size).then(res => {
                    this.remoteData = res.data['data']
                    this.pagination.count = res.data['count']
                }).finally(_ => {
                    this.isLoading = false
                })
            }
        }
    }

</script>
<style lang="postcss" scoped>
  @import "./index.css";
</style>
