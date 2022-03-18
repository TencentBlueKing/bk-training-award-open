<template>
    <div class="mycheck-container">
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
                'tab-name': '已审批',
                'tab-key': 'ended-approval'
            }
            ]"
            v-model="curSelectedTable"
        >
            <bk-table class="mt10"
                :pagination="pagination"
                @page-change="handleChangePage($event)"
                @page-limit-change="handleChangeLimit($event)"
                :data="tableData"
            >
                <bk-table-column label="序号"
                    type="index"
                    width="60"
                    fixed="left"
                ></bk-table-column>
                <bk-table-column label="奖项名称">
                    <template slot-scope="props">
                        <!-- 建议可跳转 但是这个依赖于获取详情后的页面信息接口，暂时没有 -->
                        <span>{{ props.row['award_name'] }}</span>
                    </template>
                </bk-table-column>
                <bk-table-column label="申请人">
                    <template slot-scope="props">
                        <span v-for="(username,applicationUser) in props.row['application_users'] || []"
                            :key="username"
                        >
                            {{ applicationUser }}({{ username }})
                        </span>
                    </template>
                </bk-table-column>
                <bk-table-column label="申请时间" prop="application_time"></bk-table-column>
                <bk-table-column label="申请理由" prop="application_reason"></bk-table-column>

                <bk-table-column label="当前审批轮次">
                    <template slot-scope="props">
                        第 {{ props.row['approval_turn'] + 1 }} 轮
                    </template>
                </bk-table-column>
                <bk-table-column label="申请附件">
                    <template slot-scope="props">
                        <bk-button
                            @click="toAttachFilePreview(props.row['application_attachments'])"
                            :text="true"
                        >
                            查看附件
                        </bk-button>
                    </template>
                </bk-table-column>

                <bk-table-column label="评审状态"
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
                    width="150"
                    fixed="right"
                >
                    <template slot-scope="props">
                        <bk-button :class="['mr10',props.row['approval_state_en']]"
                            theme="primary"
                            v-show="props.row['approval_state'] === config['award_approval_state_controller']['review_pending']"
                            :text="true"
                            @click="toCheck(props.row,
                                            config['button_controller_action']['pass'],
                                            '通过' + props.row['application_users_list'][0]
                                                + props.row['application_users_list'].length
                                                + '人的申请')"
                        >
                            通过
                        </bk-button>
                        <bk-button :class="['mr10',props.row['approval_state_en']]"
                            theme="primary"
                            :text="true"
                            v-show="props.row['approval_state'] === config['award_approval_state_controller']['review_pending']"
                            @click="toCheck(props.row,
                                            config['button_controller_action']['no_pass'],
                                            '退回' + props.row['application_users_list'][0]
                                                + props.row['application_users_list'].length
                                                + '人的申请')"
                        >
                            打回
                        </bk-button>
                        <span class="text-gray" style="cursor:pointer;" v-show="props.row['approval_state'] !== config['award_approval_state_controller']['review_pending']">
                            --
                        </span>
                    </template>
                </bk-table-column>
            </bk-table>
        </tabs>
        <bk-dialog v-model="approvalForm.editing"
            :header-position="'left'"
            :confirm-fn="() => handleConfirmToSubmitDelApproval(approvalForm)"
        >
            <template slot="header">
                <span class="em f16">
                    {{ approvalForm.tips }}
                </span>
            </template>
            <bk-input class="mb15"
                :placeholder="'请输入评语'"
                :type="'textarea'"
                :rows="5"
                v-model="approvalForm.approval_text"
            >
            </bk-input>
        </bk-dialog>
        <bk-dialog v-model="isPreviewAttachFiles">
            <ul class="file-list">
                <li v-for="(file,fileIdx) in tmpAttachFiles" :key="file.url"
                    class="mt5 file-item"
                >
                    <bk-link :href="file.path"
                        theme="primary"
                    >
                        {{fileIdx + 1}} {{file.name}}
                    </bk-link>

                </li>
            </ul>
        </bk-dialog>
    </div>
</template>

<script>
    import { getApproval, postApproval } from '@/api/service/apply-service'
    import {
        APPLY_APPROVAL_STATE_EN_MAP,
        APPLY_APPROVAL_STATE_MAP,
        REVIEW_PENDING,
        REVIEW_PASSED,
        REVIEW_NOT_PASSED

    } from '@/constants'
    import moment from 'moment'

    export default {
        data () {
            return {
                remoteData: [],
                pagination: {
                    current: 1,
                    count: 0,
                    limit: 10,
                    award_name: [],
                    department_name: []
                },
                config: {
                    award_approval_state_controller: {
                        pass: REVIEW_PASSED,
                        no_pass: REVIEW_NOT_PASSED,
                        review_pending: REVIEW_PENDING
                    },
                    button_controller_action: {
                        pass: REVIEW_PASSED,
                        no_pass: REVIEW_NOT_PASSED,
                        review_pending: REVIEW_PENDING
                      
                    }
                },
                approvalForm: {
                    tips: '',
                    editing: false,
                    id: null,
                    action: null,
                    approval_text: ''
                },
                // S 弹框控制区域
                // 附件展示
                isPreviewAttachFiles: false,
                tmpAttachFiles: [],
                // S 弹框控制区域
                curSelectedTable: ''
            }
        },
        computed: {
            tableData (self) {
                return self.remoteData?.map(item => {
                    return {
                        ...item['award_info'],
                        ...item,
                        application_time: moment(item['application_time']).format('YYYY-MM-DD hh:mm:ss'),
                        application_users_list: Object.values(item['application_users'] ?? {}),
                        approval_state_cn: APPLY_APPROVAL_STATE_MAP[item['approval_state']],
                        approval_state_en: APPLY_APPROVAL_STATE_EN_MAP[item['approval_state']]
                    }
                }) ?? []
            }
        },
        created () {
            this.handleInit()
        },
        methods: {
            /**
             * 初始化数据的接口
             * */
            handleInit () {
                this.handleGetPageData()
            },
            handleChangePage (curren) {
                this.pagination.current = curren
                this.handleGetPageData()
            },
            handleChangeLimit (limit) {
                this.pagination.current = 1
                this.pagination.limit = limit
                this.handleGetPageData()
            },
            /**
             * 全局获取数据的接口
             * */
            handleGetPageData (current = this.pagination.current, size = this.pagination.limit) {
                return getApproval(current, size).then(res => {
                    this.remoteData = res.data['results']
                    this.pagination = res.data['count']
                })
            },
            toCheck (curInfo, action, tips) {
                console.log(curInfo)
                this.approvalForm.id = curInfo['id']
                this.approvalForm.editing = true
                this.approvalForm.action = action
                this.approvalForm.tips = tips
                this.approvalForm.approval_text = ''
            },
            /**
             * 提交审核结果
             * */
            async handleConfirmToSubmitDelApproval (form) {
                return new Promise(resolve => {
                    postApproval(form).then(_ => {
                        this.messageSuccess('审批成功')
                        this.handleGetPageData()
                        this.approvalForm.editing = false
                    })
                })
            },
            toAttachFilePreview (filesList) {
                this.isPreviewAttachFiles = true
                this.tmpAttachFiles = filesList
            }

        }
    }
</script>

<style scoped>
@import './index.css';
</style>
