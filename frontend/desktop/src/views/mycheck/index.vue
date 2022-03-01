<template>
    <div class="mycheck-container">
        <!--        <bk-form form-type="inline">-->
        <!--            <bk-form-item-->
        <!--                label="部门名称"-->
        <!--                class="mt10"-->
        <!--                label-width="auto"-->
        <!--            >-->
        <!--                <bk-input v-model="pagination.department_name"-->
        <!--                    placeholder="请输入部门名称"-->
        <!--                    class="inline-block"-->
        <!--                    style="width: 200px;"-->
        <!--                    :right-icon="'bk-icon icon-search'"-->
        <!--                    :clearable="true"-->
        <!--                >-->
        <!--                </bk-input>-->
        <!--            </bk-form-item>-->

        <!--            <bk-form-item-->
        <!--                label="奖项名称"-->
        <!--                class="mt10"-->
        <!--                label-width="auto"-->
        <!--            >-->
        <!--                <bk-input v-model="pagination.award_name"-->
        <!--                    placeholder="请输入奖项名称"-->
        <!--                    class="inline-block"-->
        <!--                    :right-icon="'bk-icon icon-search'"-->
        <!--                    :clearable="true"-->
        <!--                    style="width: 200px;"-->
        <!--                >-->
        <!--                </bk-input>-->
        <!--            </bk-form-item>-->
        <!--        </bk-form>-->
        <div>
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
                <bk-table-column label="申请附件">
                    <template slot-scope="props">
                        <bk-link v-for="file in props.row['application_attachments']"
                            :key="file['url']"
                            theme="primary"
                            :href="file['path']"
                            class="mr10 f12"
                        >
                            {{ file['name'] }}
                        </bk-link>
                    </template>
                </bk-table-column>
                <bk-table-column label="当前审批轮次">
                    <template slot-scope="props">
                        第 {{ props.row['approval_turn'] + 1 }} 轮
                    </template>
                </bk-table-column>

                <bk-table-column label="审批状态"
                    width="150"
                    fixed="right"
                >
                    <template slot-scope="props">
                        <bk-button :class="['mr10',props.row['approval_state_en']]"
                            theme="primary"
                            text
                            @click="toCheck(props.row,
                                            config['button_controller_action']['pass'],
                                            '通过' + props.row['application_users_list'] + '的申请')"
                        >
                            通过
                        </bk-button>
                        <bk-button :class="['mr10',props.row['approval_state_en']]"
                            theme="primary"
                            text
                            @click="toCheck(props.row,
                                            config['button_controller_action']['no_pass'],
                                            '退回' + props.row['application_users_list'] + '的申请')"
                        >
                            打回
                        </bk-button>
                    </template>
                </bk-table-column>
            </bk-table>
        </div>
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
    </div>
</template>

<script>
    import { getApproval, postApproval } from '@/api/service/apply-service'
    import { AWARD_APPROVAL_STATE_EN_MAP, AWARD_APPROVAL_STATE_MAP, NOT_APPLY } from '@/constants'
    import moment from 'moment'

    export default {
        data () {
            return {
                userInfo: null,
                size: 'small',
                departValue: '',
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
                        [NOT_APPLY]: '待审批'
                    },
                    button_controller_action: {
                        pass: 1,
                        no_pass: 0
                    }
                },
                approvalForm: {
                    tips: '',
                    editing: false,
                    id: null,
                    action: null,
                    approval_text: ''
                }

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
                        approval_state_cn: AWARD_APPROVAL_STATE_MAP[item['approval_state']],
                        approval_state_en: AWARD_APPROVAL_STATE_EN_MAP[item['approval_state']]
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
                    console.log(res)
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
            }

        }
    }
</script>

<style scoped>
@import './index.css';
</style>
