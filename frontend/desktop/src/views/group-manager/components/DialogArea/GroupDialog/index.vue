<template>
    <div class="dialog-container">
        <bk-dialog v-model="visible"
            theme="primary"
            header-position="left"
            size="small"
            :mask-close="false"
            ext-cls="dialog"
            @confirm="$emit('confirm',formData)"
            @cancel="$emit('cancel',formData)"
        >
            <p slot="header"
                class="dialog-title"
                style="font-size: 17px;font-weight: bold;"
            >
                {{dialogOptions[dialogType].title}}
            </p>
            <bk-form :label-width="80" :model="formData" :rules="rules" v-if="visible">
                <bk-form-item v-for="option in settings" :key="option.prop" :label="option.label" :required="true" :property="'name'">
                    <bk-input v-model="formData[option.prop]" :placeholder="'请输入' + (option.placeholder ? option.placeholder : option.label)"></bk-input>
                </bk-form-item>
            </bk-form>
        </bk-dialog>
    </div>
</template>
<script>
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
            return {
                visible: false,
                rules: [],
                // 用于接收表单字段
                formData: {
                    level: '',
                    master: '',
                    organisation: '',
                    organizationName: ''
                },
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
                        prop: 'organizationName',
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
                ]
            }
        },
        methods: {
            show (options = {
                data: null,
                callback () {}
            }) {
                const formData = this.formData
                if (options.data) {
                    Object.keys(formData).forEach(key => {
                        formData[key] = options.data[key]
                    })
                }
                this.visible = true
            },
            hidden () {
                this.visible = false
            },
            getFormData () {
                return this.formData
            }
        }
    }
</script>
<style scoped>
    @import "./index.css";
</style>
