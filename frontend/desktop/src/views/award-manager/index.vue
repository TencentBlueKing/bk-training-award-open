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
                                    @click="toAddNewAward($refs['NewAwardForm'])">
                                    新增
                                </bk-button>
                                <bk-button theme="default"
                                    @click="toBatchClone($refs['BatchCloneForm'],selectData)">
                                    批量克隆
                                </bk-button>
                                <bk-button theme="default"
                                    @click="toSendEmail($refs['BatchSendEmailForm'])">
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
            :height="isFilter ? '70%' : '80%'"
            @page-change="handlePageChange"
            @page-limit-change="handlePageLimitChange"
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
        <DialogArea ref="NewAwardForm" title="新增奖项">
            <NewAwardForm slot="custom"></NewAwardForm>
        </DialogArea>
        <DialogArea ref="EditRowDialog" title="编辑奖项">
            <NewAwardForm slot="custom"></NewAwardForm>
        </DialogArea>
        <DialogArea ref="GetDetailDialog" title="奖项详情">
            <NewAwardForm slot="custom"></NewAwardForm>
        </DialogArea>

        <DialogArea ref="BatchCloneForm" title="批量克隆">
            <BatchCloneForm slot="custom" :form-data="selectData" :total-data="tableData"></BatchCloneForm>
        </DialogArea>
        <DialogArea ref="BatchSendEmailForm" title="批量发送邮件">
            <BatchSendEmailForm slot="custom"></BatchSendEmailForm>
        </DialogArea>
        <DialogArea ref="NotificationForm" title="编辑公示">
            <NotificationForm slot="custom"></NotificationForm>
        </DialogArea>
        <DialogArea ref="EndAwardForm" title="删除奖项">
            <EndAwardForm slot="custom"></EndAwardForm>
        </DialogArea>
        <!-- /弹出区域 -->
    </div>
</template>
<script>
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
        data () {
            return {
                // S 控制信息区
                // 表格尺寸
                size: 'small',

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
                remoteData: new Array(10).fill({}).map((item, index) => {
                    if (index === 2) {
                        return {
                            ...item,
                            isProcess: true
                        }
                    }
                    return { ...item }
                }),
                // 分页信息
                pagination: {
                    current: 1,
                    count: 10,
                    limit: 10
                },
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
            this.notImplemented = (feature) => {
                const message = `正在开发: ${feature}`
                alert(message)
                throw new Error(message)
            }
        },
        mounted () {
        },
        methods: {
            // S 修复区域
            adjustTable () {
                document.querySelector('.main-content').style.minHeight = '0'
                document.querySelector('.main-content').style.height = '100%'
            },
            // E 修复区域
            // 弹出框控制区
            toAddNewAward (newAwardDialog) {
                newAwardDialog.show()
            },
            toBatchClone (batchCloneDialog, selectData) {
                if (!selectData.length) {
                    this.handleErrorMessageTips('请先选择奖项')
                    return null
                }
                batchCloneDialog.show()
            },
            toSendEmail (sendEmailDialog) {
                // console.log('batchCloneDialog->', batchCloneDialog)
                sendEmailDialog.show()
                this.notImplemented('数据接口对接')
            },
            toBatchExport (batchExportDialog) {
                this.notImplemented('导出数据')
            },
            toSendNotification (sendNotificationDialog) {
                sendNotificationDialog.show()
                this.notImplemented('获取成员信息')
            },
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
            toEndAward (rawData, EndAwardForm) {
                EndAwardForm.show()
            },
            confirmDelAward () {
                this.notImplemented('确认删除奖项')
            },
            // 信息提示二次封装
            handleShowMessage (message, theme) {
                this.$bkMessage({
                    message,
                    theme,
                    offsetY: 80
                })
            },
            handleErrorMessageTips (message) {
                this.handleShowMessage(message, 'error')
            },
            handleSucessMessageTips (message) {
                this.handleShowMessage(message, 'success')
            },

            handleSetSelectData (selectData) {
                console.log('selectData->', selectData)
                this.selectData = [...selectData]
            }
        }
    }
</script>
<style scoped>
    @import "./index.css";
</style>
