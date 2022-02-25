<template>
    <div class="dialog-container">
        <bk-dialog v-model="visible"
            :render-directive="'if'"
            theme="primary"
            header-position="left"
            size="small"
            ext-cls="dialog"
            :mask-close="false"
            :loading="$attrs['loading']"
            :confirm-fn="handleDialogConfirm"
            @cancel="handleDialogCancel(formData)"
        >
            <p slot="header"
                class="dialog-title f17 fb"
            >
                {{ config[dialogType].title }}
            </p>
            <bk-form :label-width="80"
                v-if="visible"
                :model="formData"
                :rules="rules"
                ref="form"
            >
                <bk-form-item label="组名称"
                    :required="true"
                    property="name"
                >
                    <select-search
                        placeholder="请选择现有组织"
                        :value.sync="groupInfo"
                        type="group"
                        :multiple="false"
                        :disabled="config[dialogType]['groupNameDisabled']"
                    >
                    </select-search>
                </bk-form-item>
                <bk-form-item label="负责人"
                    :required="true"
                    property="master"
                >
                    <select-search
                        placeholder="请选择负责人"
                        :value.sync="secretaries"
                        :id-key="'username'"
                    >
                    </select-search>
                </bk-form-item>
            </bk-form>
        </bk-dialog>
    </div>
</template>
<script>
    import { GROUP_KEYNAME, GROUP_USERS_KEYNAME } from '@/constants'

    export default {
        name: 'group-dialog',
        components: { SelectSearch: () => import('@/components/select-search') },
        props: {
            dialogType: {
                type: String,
                default () {
                    return 'creator'
                }
            }
        },
        data () {
            /**
             * 静态规则
             * */
            return {
                config: {
                    'editor': {
                        'title': '编辑组秘书信息',
                        'groupNameDisabled': true
                    },
                    'creator': {
                        'title': '指派秘书'
                    }
                },
                visible: false,
                // 用于接收表单字段
                formData: {
                    secretaries: [],
                    group_id: '',
                    group_full_name: ''
                },
                /**
                 * 规则验证
                 * */
                rules: Object.freeze({
                    name: [
                        { required: true, message: '请输入组织名', trigger: 'blur' }
                    ],
                    secretaries: [
                        { required: true,
                          message: '请选择奖项负责人',
                          trigger: 'blur',
                          type: Array
                        }
                    ],
                    organisation: [
                        { required: true, message: '请输入组织名', trigger: 'blur' }
                    ]
                }),
                // 用于结合字段配置表单字段
                settings: [
                    {
                        prop: 'name',
                        label: '组织名'
                    },
                    {
                        prop: 'level',
                        label: '级别'
                    },
                    {
                        prop: 'master',
                        label: '负责人'
                    }
                ],
                /**
                 * 临时放置，后续转为 store 或者其他
                 * */
                totalMaster: [],
                totalDepartment: []
            }
        },
        computed: {
            secretaries: {
                get (self) {
                    return self.formData.secretaries.map(item => item.username)
                },
                set (newValue) {
                    this.formData.secretaries = this.$http.cache.get(GROUP_USERS_KEYNAME)?.filter(item => {
                        return newValue.includes(item['username'])
                    })
                }
            },
            groupInfo: {
                get (self) {
                    return self.formData.group_id
                },
                set (newValue) {
                    const formData = this.formData
                    const totalDepartment = this.$http.cache.get(GROUP_KEYNAME)
                    formData.group_id = newValue
                    formData.group_full_name = totalDepartment.find(item => item.id === newValue)['full_name']
                }
            }
        },
        created () {
            this.handleInit()
        },
        methods: {
            /**
             * 初始化信息
             * */
            handleInit () {
            },

            /**
             * 校验合法性
             * */
            checkValid () {
                const form = this.$refs['form']
                return new Promise((resolve) => {
                    form.validate().then(res => {
                        resolve(true)
                    }).catch(_ => {
                        resolve(false)
                    })
                })
            },
            /**
             * 弹框确认
             * */
            async handleDialogConfirm (self) {
                if (!await this.checkValid()) return
                this.$emit('confirm', this.formData)
            },
            /**
             * 弹框禁止
             * */
            handleDialogCancel (formData) {
                this.$emit('cancel', formData)
                this.hidden()
            },
            /**
             * 下面是用于控制弹窗的函数
             * */
            show (options = {
                data: null,
                callback () {
                }
            }) {
                if (options.data) {
                    this.formData = { ...options.data }
                }
                this.visible = true
            },
            hidden () {
                this.visible = false
                this.formData = {
                    secretaries: [],
                    group_id: '',
                    group_full_name: ''
                }
            }
        }
    }
</script>
<style lang="postcss" scoped>
</style>
