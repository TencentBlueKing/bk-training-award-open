<template>
    <div class="award-container">
        <!-- 头部按钮区域 -->
        <div class="header-container f-c-space-arround">
            <div class="filter-panel">
                <!-- 高级筛选区域按钮开始 -->
                <bk-collapse v-model="isFilter">
                    <bk-collapse-item name="filter-panel" :hide-arrow="true" :custom-trigger-area="true">
                        <div class="button-panel" slot="no-trigger">
                            <!-- 左边按钮盘 -->
                            <div class="left-panel">
                                <bk-button type="default" @click="toAddNewAward($refs['NewAwardForm'])">新增</bk-button>
                                <bk-button type="default" @click="toBatchClone($refs['BatchCloneForm'])">批量克隆</bk-button>
                                <bk-button type="default" @click="toSendEmail($refs['BatchSendEmailForm'])">邮件通知</bk-button>
                                <bk-button type="default" @click="toBatchExport($refs['BatchExportForm'])">批量导出</bk-button>
                                <bk-button type="default" @click="toSendNotification($refs['NotificationForm'])">获奖公示</bk-button>
                            </div>
                            <!-- /左边按钮盘 -->
                            <!-- 右边按钮区域 -->
                            <div class="right-panel">
                                <bk-button ext-cls="fliter-button"
                                    type="default"
                                    @click="toShowFilterPanel($event)">
                                    <!-- TODO: 替换图标 -->
                                    <bk-icon type="filter" />
                                </bk-button>
                            </div>
                            <!-- /右边按钮区域 -->
                        </div>
                        <bk-form slot="content" form-type="inline" :label-width="200">
                            <bk-container :col="24" :gutter="2" flex>
                                <bk-row>
                                    <bk-col :span="8">
                                        <bk-form-item label="部门名称">
                                            <bk-input placeholder="名称" v-model="formData.name"></bk-input>
                                        </bk-form-item>
                                    </bk-col>
                                    <bk-col :span="8">
                                        <bk-form-item label="开始申请时间">
                                            <bk-input placeholder="名称" v-model="formData.name"></bk-input>
                                        </bk-form-item>
                                    </bk-col>
                                    <bk-col :span="8">
                                        <bk-form-item label="奖项名称">
                                            <bk-input placeholder="名称" v-model="formData.name"></bk-input>
                                        </bk-form-item>
                                    </bk-col>
                                </bk-row>
                                <div style="height:12px;"></div>
                                <bk-row>
                                    <bk-col :span="8">
                                        <bk-form-item label="流程状态">
                                            <bk-input placeholder="名称" v-model="formData.name"></bk-input>
                                        </bk-form-item>
                                    </bk-col>
                                    <bk-col :span="8">
                                        <bk-form-item label="截止申请时间">
                                            <bk-input placeholder="名称" v-model="formData.name"></bk-input>
                                        </bk-form-item>
                                    </bk-col>
                                    <div class="f-space-arround">
                                        <bk-button theme="success">筛选过滤</bk-button>
                                        <bk-button theme="danger">清空查询</bk-button>
                                    </div>
                                </bk-row>
                            </bk-container>
                        </bk-form>
                    </bk-collapse-item>
                </bk-collapse>
            </div>
        </div>
        <!-- /头部按钮区域 -->
        <!-- 表格按钮区域 -->
        <div>
            <bk-table style="margin-top: 15px;"
                :data="tableData"
                :size="size"
                :pagination="pagination"
                height="500px"
                @page-change="handlePageChange"
                @page-limit-change="handlePageLimitChange"
                :virtual-render="true">
                <!-- TODO 转化为 配置型 -->
                <bk-table-column type="selection" width="60"></bk-table-column>
                <bk-table-column prop="awardName" label="奖项名称"></bk-table-column>
                <bk-table-column prop="awardStatus" label="状态"></bk-table-column>
                <bk-table-column prop="startApplyTime" label="开始申请时间"></bk-table-column>
                <bk-table-column prop="endApplyTime" label="截止申请时间"></bk-table-column>
                <bk-table-column label="操作">
                    <template slot-scope="props">
                        <div v-show="!props.row.isProcess">
                            <bk-button theme="primary" text @click="toEditRow(props.row,$refs['EditRowDialog'])">编辑</bk-button>
                            <bk-button theme="primary" text @click="toDelRow(props.row,$refs['DelRowDialog'])">删除</bk-button>
                            <bk-button theme="primary" text @click="toGetDetail(props.row,$refs['GetDetailDialog'])">详情</bk-button>
                        </div>
                        <div v-show="props.row.isProcess">
                            <bk-button theme="primary" text @click="toEndAward(props.row,$refs['EditRowDialog'])">结束</bk-button>
                        </div>
                    </template>
                </bk-table-column>
            </bk-table>
        </div>
        <!-- /表格按钮区域 -->
        <!-- 弹出区域 -->
        <NewAwardForm ref="NewAwardForm"></NewAwardForm>
        <BatchCloneForm ref="BatchCloneForm"></BatchCloneForm>
        <BatchSendEmailForm ref="BatchSendEmailForm"></BatchSendEmailForm>
        <NotificationForm ref="NotificationForm"></NotificationForm>
        <!-- /弹出区域 -->
    </div>
</template>
<script>
    export default {
        components: {
            NewAwardForm: () => import('./components/DialogArea/NewAwardForm'),
            BatchCloneForm: () => import('./components/DialogArea/BatchCloneForm'),
            BatchSendEmailForm: () => import('./components/DialogArea/BatchSendEmailForm'),
            NotificationForm: () => import('./components/DialogArea/NotificationForm')
        },
        data () {
            return {
                // S 控制信息区
                // 表格尺寸
                size: 'small',

                // 是否展示高级筛选区域
                isFilter: '',
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
                formData: {}
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
        methods: {
            // 弹出框控制区
            toAddNewAward (newAwardDialog) {
                newAwardDialog.show()
                this.notImplemented('弹出表格')
            },
            toBatchClone (batchCloneDialog) {
                batchCloneDialog.show()
                this.notImplemented('批量克隆')
            },
            toSendEmail (sendEmailDialog) {
                sendEmailDialog.show()
            },
            toBatchExport (batchExportDialog) {
                batchExportDialog.show()
                this.notImplemented('批量导出')
            },
            toSendNotification (sendNotificationDialog) {
                console.log(sendNotificationDialog)
                sendNotificationDialog.show()
            },
            toShowFilterPanel () {
                this.isFilter = this.isFilter ? '' : 'filter-panel'
            },
            toEditRow (EditRowDialog) {
                EditRowDialog.show()
            },
            toDelRow (DelRowDialog) {
                DelRowDialog.show()
            },
            toGetDetail (GetDetailDialog) {
                GetDetailDialog.show()
            }
        }
    }
</script>
<style>
    @import "./index.css";
</style>
