<template>
    <div class="dialog-container">
        <bk-dialog v-model="visible"
            theme="primary"
            header-position="left"
            size="small"
            ext-cls="dialog"
            :mask-close="false"
            :confirm-fn="handleDialogConfirm"
            @cancel="handleDialogCancel(formData)"
        >
            <p slot="header"
                class="dialog-title f17 fb"
            >
                {{dialogOptions[dialogType].title}}
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
                    <bk-input placeholder="请输入组织名称"
                        v-model="formData['name']"
                    ></bk-input>
                </bk-form-item>
                <bk-form-item label="负责人"
                    :required="true"
                    property="master"
                >
                    <bk-select multiple
                        display-tag
                        v-model="formData['master']"
                        placeholder="请选择申请人"
                    >
                        <bk-option v-for="user in groupUsers"
                            :key="user.username"
                            :id="user.username"
                            :name="user.displayName">
                        </bk-option>
                    </bk-select>
                </bk-form-item>
                <bk-form-item label="级别"
                    :required="true"
                    property="level"
                >
                    <bk-select placeholder="请选择级别"
                        v-model="formData['level']"
                    >
                        <bk-option v-for="option in awardLevels"
                            :key="option.id"
                            :id="option.id"
                            :name="option.level">
                        </bk-option>
                    </bk-select>
                </bk-form-item>
            </bk-form>
        </bk-dialog>
    </div>
</template>
<script>
    import { mapActions, mapGetters } from 'vuex'

    export default {
        name: 'group-dialog',
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
                visible: false,
                // 用于接收表单字段
                formData: {
                    level: '',
                    master: [],
                    organisation: '',
                    name: ''
                },
                /**
                 * 规则验证
                 * */
                rules: Object.freeze({
                    name: [
                        { required: true, message: '请输入组织名', trigger: 'blur' }
                    ],
                    level: [
                        { required: true, message: '请选择奖项等级', trigger: 'blur' }
                    ],
                    master: [
                        { required: true, message: '请选择奖项负责人', trigger: 'blur' }
                    ],
                    organisation: [
                        { required: true, message: '请输入组织名', trigger: 'blur' }
                    ]
                }),
                dialogOptions: {
                    editor: {
                        title: '编辑组'
                    },
                    creator: {
                        title: '新增组'
                    }
                },
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
                totalMaster: []
            }
        },
        computed: {
            ...mapGetters('groupModule', ['groupUsers']),
            ...mapGetters('awardModule', ['awardLevels'])

        },
        methods: {
            ...mapActions('groupModule', [
                'getUserManageListUsers'
            ]),
            ...mapActions('awardModule', [
                'getAwardLevels'
            ]),
            /**
             * 初始化信息
             * */
            handleInit () {
                this.getUserManageListUsers()
                this.getAwardLevels()
            },
            /**
             * 校验合法性
             * */
            checkValid () {
                const form = this.$refs['form']
                return new Promise((resolve, reject) => {
                    form.validate().then(res => {
                        console.log('res', res)
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
                if (await this.checkValid()) {
                    this.$emit('confirm', self.formData)
                }
            },
            /**
             * 弹框禁止
             * */
            handleDialogCancel (formData) {
                // TODO: 如果信息有所改变，对关闭进行拦截
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
                this.handleInit()
                this.visible = true
            },
            hidden () {
                this.visible = false
            }
        }
    }
</script>
<style scoped>
    @import "./index.css";
</style>
