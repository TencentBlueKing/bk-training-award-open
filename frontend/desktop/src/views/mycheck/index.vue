<template>
    <div class="mycheck-container">
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
            :tab-items="checkTabItems"
            v-model="workbench"
        >
            <bk-select slot="right-controller"
                style="width: calc(2*118px + 1*8px);font-size: 15px;"
                v-model="approvalType"
                ext-cls="select-custom"
                ext-popover-cls="select-popover-custom"
                :clearable="false"
            >
                <bk-option id="group" name="小组审批" v-if="$bus.isCurGroupAdmin"> </bk-option>
                <bk-option id="award" name="奖项审批"> </bk-option>
            </bk-select>
            <template>
                <!-- 这里取了一下巧，后续改着可能会难受，但是问题应该不大 -->
                <component :is="curComponentName" :ref="curComponentName"></component>
            </template>
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
                        {{ fileIdx + 1 }} {{ file.name }}
                    </bk-link>
                </li>
            </ul>
        </bk-dialog>
    </div>
</template>
<script>
    import { getAwardApproval, postApproval } from '@/api/service/apply-service'
    import {
        APPLY_APPROVAL_STATE_EN_MAP,
        APPLY_APPROVAL_STATE_MAP
    } from '@/constants'
    import moment from 'moment'

    export default {
        components: {
            AwardPendingApproval: () => import('./table/award-pending-approval'),
            AwardEndedApproval: () => import('./table/award-ended-approval'),
            GroupPendingApproval: () => import('./table/group-pending-approval'),
            GroupEndedApproval: () => import('./table/group-ended-approval')
        },
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
                // Tab 栏
                workbench: 'pending-approval',
                approvalType: 'award',
                checkTabItemsTemplate: [
                    {
                        'tab-name': '待审批',
                        'tab-key': 'pending-approval'
                    },
                    {
                        'tab-name': '已审批',
                        'tab-key': 'ended-approval'
                    }
                ]
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
            },
            curComponentName (self) {
                return `${self.approvalType}-${self.workbench}`
            },
            checkTabItems (self) {
                return self.checkTabItemsTemplate
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
                const curTable = this.curComponentName
                this.$refs[curTable]?.handleInit()
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
                return getAwardApproval(current, size).then(res => {
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
