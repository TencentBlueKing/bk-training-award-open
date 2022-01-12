<template>
    <div class="new-award-form-container">
        <bk-dialog v-model="visible"
            theme="primary"
            :mask-close="false"
            header-position="left"
            title="新增奖项">
            <bk-form :label-width="200" form-type="vertical">
                <bk-form-item label="项目名称" :required="true">
                    <bk-input v-model="formData.name"></bk-input>
                </bk-form-item>
                
                <bk-form-item label="接口人" :required="true">
                    <bk-input v-model="formData.name"></bk-input>
                </bk-form-item>

                <bk-form-item label="项目描述" :required="true">
                    <bk-input v-model="formData.name"></bk-input>
                </bk-form-item>
                <bk-form-item label="图片" :required="true">
                    <bk-input v-model="formData.name"></bk-input>
                </bk-form-item>
                
                <bk-form-item label="奖项级别" :required="true">
                    <bk-input v-model="formData.name"></bk-input>
                </bk-form-item>
                
                <bk-form-item label="项目名称" :required="true">
                    <bk-input v-model="formData.name"></bk-input>
                </bk-form-item>
                
                <bk-form-item label="开始申请时间" :required="true">
                    <bk-input v-model="formData.name"></bk-input>
                </bk-form-item>
                <bk-form-item label="截止申请时间" :required="true">
                    <bk-input v-model="formData.name"></bk-input>
                </bk-form-item>
                <bk-form-item label="评审人" :required="true">
                    <bk-input v-model="formData.name"></bk-input>
                </bk-form-item>

            </bk-form>
        </bk-dialog>
    </div>
</template>
<script>
    import { dialogMixins } from '../mixins'
    export default {
        name: 'new-award-form',
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
