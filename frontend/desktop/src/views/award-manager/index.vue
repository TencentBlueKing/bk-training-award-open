<template>
    <div class="award-container">
        <!-- 头部按钮区域 -->
        <div class="header-container f-c-space-arround">
            <div class="filter-panel">
                <bk-collapse v-model="isFilter">
                    <bk-collapse-item name="filter-panel"
                        :hide-arrow="true"
                        :custom-trigger-area="true">
                        <div class="button-panel" slot="no-trigger">
                            <!-- 左边按钮盘 -->
                            <div class="left-panel">
                                <bk-button theme="primary"
                                    icon="plus-circle-shape"
                                    @click="toAddNewAward($refs['NewAwardDialog'])">
                                    新增
                                </bk-button>
                                <bk-button theme="default"
                                    @click="toBatchClone($refs['BatchCloneForm'],selectData)">
                                    批量克隆
                                </bk-button>
                                <bk-button theme="default"
                                    @click="toSendEmail($refs['BatchSendEmailForm'],selectData)">
                                    邮件通知
                                </bk-button>
                                <bk-button theme="default"
                                    @click="toBatchExport($refs['BatchExportForm'])">
                                    批量导出
                                </bk-button>
                                <bk-button theme="default"
                                    @click="toSendNotification($refs['NotificationForm'])">
                                    获奖公示
                                </bk-button>
                            </div>
                            <!-- /左边按钮盘 -->
                            <!-- 右边按钮区域 -->
                            <div class="right-panel">
                                <bk-button ext-cls="filter-button f-center"
                                    type="default"
                                    @click="toShowFilterPanel($event)">
                                    <!-- TODO: 替换图标 -->
                                    <FilterSvg></FilterSvg>
                                </bk-button>
                            </div>
                            <!-- /右边按钮区域 -->
                        </div>
                        <!-- 高级筛选区域按钮开始 -->
                        <bk-form slot="content"
                            form-type="inline"
                            :label-width="20"
                            ext-cls="filter-form"
                        >
                            <bk-container :col="24" :gutter="1" flex>
                                <bk-row>
                                    <bk-col :span="8">
                                        <bk-form-item label="部门名称">
                                            <bk-input placeholder="请输入部门名称"
                                                v-model="formData.name"
                                                :clearable="true"
                                            >
                                            </bk-input>
                                        </bk-form-item>
                                    </bk-col>
                                    <bk-col :span="8">
                                        <bk-form-item label="开始申请时间">
                                            <bk-date-picker ext-cls="w-99"
                                                v-model="initDateTime"
                                                :placeholder="'选择开始申请时间'"
                                                :type="'datetime'"
                                            >
                                            </bk-date-picker>
                                        </bk-form-item>
                                    </bk-col>
                                    <bk-col :span="8">
                                        <bk-form-item label="奖项名称">
                                            <bk-input placeholder="请输入奖项名称"
                                                v-model="formData.name"
                                                :clearable="true"
                                            >
                                            </bk-input>
                                        </bk-form-item>
                                    </bk-col>
                                </bk-row>
                                <div style="height:12px;"></div>
                                <bk-row>
                                    <bk-col :span="8">
                                        <bk-form-item ext-cls="w-100" label="流程状态">
                                            <bk-select :disabled="false" v-model="value"
                                                ext-cls="form-item w-99"
                                                ext-popover-cls="select-popover-custom"
                                                placeholder="请选择奖项状态"
                                                searchable
                                                :clearable="true"
                                            >
                                                <bk-option v-for="option in list"
                                                    :key="option.id"
                                                    :id="option.id"
                                                    :name="option.name"
                                                >
                                                </bk-option>
                                            </bk-select>
                                        </bk-form-item>
                                    </bk-col>
                                    <bk-col :span="8">
                                        <bk-form-item label="截止申请时间">
                                            <bk-date-picker ext-cls="w-99"
                                                v-model="initDateTime"
                                                :placeholder="'选择截止申请时间'"
                                                :type="'datetime'"
                                            >
                                            </bk-date-picker>
                                        </bk-form-item>
                                    </bk-col>
                                    <bk-col :span="8">
                                        <div class="f-space-between w-80">
                                            <bk-button theme="primary">筛选过滤</bk-button>
                                            <bk-button theme="danger">清空查询</bk-button>
                                        </div>
                                    </bk-col>
                                </bk-row>
                            </bk-container>
                        </bk-form>
                    </bk-collapse-item>
                </bk-collapse>
            </div>
        </div>
        <!-- /头部按钮区域 -->
        <!-- 表格按钮区域 -->
        <!-- TODO 抽离表格 -->
        <bk-table style="margin-top: 15px;"
            :data="tableData"
            :size="size"
            :pagination="pagination"
            @page-change="handleCurrentChange($event)"
            @page-limit-change="handlePageSizeChange($event)"
            @selection-change="handleSetSelectData"
            :virtual-render="true"
        >
            <bk-table-column type="selection" width="60"></bk-table-column>
            <bk-table-column v-for="(rowLabel,rowProp) in tableSettings"
                :key="rowProp"
                :label="rowLabel"
            >
                <template slot-scope="prop">
                    <span>{{prop.row[rowProp]}}</span>
                </template>
            </bk-table-column>
            <bk-table-column label="操作">
                <template slot-scope="props">
                    <div v-show="!props.row.isProcess">
                        <bk-button theme="primary" text @click="toEditRow(props.row,$refs['EditRowDialog'])">编辑</bk-button>
                        <bk-popconfirm
                            :title="'确认删除该奖项（' + props.row.awardName + '）？'"
                            trigger="click"
                            content="删除操作无法撤回，请谨慎操作！"
                            @confirm="confirmDelAward"
                        >
                            <bk-button theme="primary" text @click="toDelRow(props.row,$refs['DelRowDialog'])">删除</bk-button>
                        </bk-popconfirm>
                        <bk-button theme="primary" text @click="toGetDetail(props.row,$refs['GetDetailDialog'])">详情</bk-button>
                    </div>
                    <div v-show="props.row.isProcess">
                        <bk-button theme="primary" text @click="toEndAward(props.row,$refs['EndAwardForm'])">结束</bk-button>
                    </div>
                </template>
            </bk-table-column>
        </bk-table>
        <!-- /表格按钮区域 -->
        <!-- 弹出区域 -->
        <DialogArea ref="NewAwardDialog"
            title="新增奖项"
        >
            <NewAwardForm slot="custom"
                ref="NewAwardForm"
            ></NewAwardForm>
            <div slot="footer">
                <bk-button class="footer-button"
                    theme="danger"
                >取消</bk-button>
                <bk-button @click="handleConfirmSubmit($refs['NewAwardForm'])"
                    class="footer-button"
                    theme="success"
                    :loading="loading.newAwardFormLoading"
                >确认新增</bk-button>
            </div>
        </DialogArea>
        <DialogArea ref="EditRowDialog" title="编辑奖项">
            <NewAwardForm slot="custom"></NewAwardForm>
        </DialogArea>
        <DialogArea ref="GetDetailDialog" title="奖项详情">
            <NewAwardForm slot="custom"></NewAwardForm>
        </DialogArea>

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
        <DialogArea ref="EndAwardForm" title="删除奖项">
            <EndAwardForm slot="custom"></EndAwardForm>
        </DialogArea>
        <!-- /弹出区域 -->
    </div>
</template>
<script>
    import { fixMixins, tableMixins } from '@/common/mixins'
    export default {
        components: {
            DialogArea: () => import('./components/DialogArea'),
            NewAwardForm: () => import('./components/DialogArea/NewAwardForm'),
            BatchCloneForm: () => import('./components/DialogArea/BatchCloneForm'),
            BatchSendEmailForm: () => import('./components/DialogArea/BatchSendEmailForm'),
            NotificationForm: () => import('./components/DialogArea/NotificationForm'),
            EndAwardForm: () => import('./components/DialogArea/EndAwardForm'),
            FilterSvg: () => import('./components/Svg/FilterSvg')
        },
        mixins: [
            /**
             * 修复 bug 的混入
             * */
            fixMixins,
            /**
             * 分页器的混入
             * */
            tableMixins
        ],
        data () {
            return {
                // S 控制信息区
                // 表格尺寸
                size: 'small',
                // loading 状态
                loading: {
                    newAwardFormLoading: false
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
            tableData () {
                // TODO: 对数据扁平处理
                const tableData = this.remoteData.map(rawData => {
                    return {
                        ...rawData,
                        awardName: '测试奖项名称',
                        awardStatus: '测试奖项状态',
                        startApplyTime: '测试开始申请时间',
                        endApplyTime: '测试结束申请时间'
                    }
                })
                return tableData
            }
        },
        created () {
            this.handleInit()
        },
        mounted () {
        },
        methods: {
            handleInit () {
                this.handlePageSizeChange(10)
            },
            // S 弹框控制区域
            // 新增
            toAddNewAward (newAwardDialog) {
                newAwardDialog.show()
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
                this.notImplemented('数据接口对接')
            },
            // 批量导出
            toBatchExport (batchExportDialog) {
                this.notImplemented('导出数据')
            },
            // 展示公告弹框
            toSendNotification (sendNotificationDialog) {
                sendNotificationDialog.show()
                this.notImplemented('获取成员信息')
            },
            // 展示高级筛选
            toShowFilterPanel () {
                this.isFilter = this.isFilter ? '' : 'filter-panel'
            },
            // 编辑当前行
            toEditRow (rowData, EditRowDialog) {
                EditRowDialog.show()
                this.notImplemented('获取详情数据传入编辑')
            },
            // 删除单行
            toDelRow (DelRowDialog) {
            },

            // 获取单行详情
            toGetDetail (rowData, GetDetailDialog) {
                GetDetailDialog.show()
                this.notImplemented('获取详情数据传入')
            },
            // 弹出结束奖项
            toEndAward (rawData, EndAwardForm) {
                EndAwardForm.show()
            },
            // E 弹框控制区域
            confirmDelAward () {
                this.notImplemented('确认删除奖项')
            },
            /**
             * 获取表单信息并提交
             * */
            async handleConfirmSubmit (NewAwardForm) {
                const loading = this.loading
                if (loading.newAwardFormLoading) {
                    return
                }
                loading.newAwardFormLoading = true
                const fields = await NewAwardForm.getFields()
                console.log('fields', fields)
                if (!fields) {
                    loading.newAwardFormLoading = false
                    return
                }
                if (fields) {
                    return this.$http.post('create_award/', fields).then(res => {
                        this.messageSuccess('创建成功')
                    }).finally(_ => {
                        loading.newAwardFormLoading = false
                    })
                }
            },
            handleSetSelectData (selectData) {
                console.log('selectData->', selectData)
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
<style scoped>
    @import "./index.css";
</style>
