<template>
    <div class="batch-send-email-container">
        <bk-dialog v-model="visible"
            theme="primary"
            :mask-close="false"
            width="70%"
            header-position="left"
            title="业务邮件预约">
            <!-- 表单主体 -->
            <bk-form :label-width="200">
                <bk-form-item label="项目名称">
                    <bk-input v-model="formData.name"></bk-input>
                </bk-form-item>
                <bk-form-item label="知会人">
                    <bk-input v-model="formData.name"></bk-input>
                </bk-form-item>
                <bk-form-item label="主题">
                    <bk-input v-model="formData.name"></bk-input>
                </bk-form-item>
                <bk-form-item label="协同编辑人">
                    <bk-input v-model="formData.name"></bk-input>
                </bk-form-item>
                <bk-form-item label="邮件正文">
                    <Editor :content="emailText"></Editor>
                </bk-form-item>
            </bk-form>
            <!-- /表单主体 -->
        </bk-dialog>
    </div>
</template>
<script>
    import Editor from '../../Editor'
    import { dialogMixins } from '../mixins'
    export default {
        name: 'batch-send-email-container',
        components: {
            Editor
        },
        mixins: [dialogMixins],
        data () {
            return {
                formData: {}
            }
        }
    }
</script>
<style>
    @import "./index.css";
</style>
