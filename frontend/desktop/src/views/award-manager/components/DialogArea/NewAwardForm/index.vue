<template>
    <div class="new-award-form-container">
        <bk-form :label-width="110" form-type="vertical">
            <bk-container :col="12" ext-cls="award-form-container" flex>
                <!-- 奖项基本信息 -->
                <bk-row>
                    <bk-col :span="6">
                        <bk-form-item label="名称" :required="true">
                            <bk-input placeholder="请输入奖项名称" v-model="formData.name"></bk-input>
                        </bk-form-item>
                    </bk-col>
                    <bk-col :span="6">
                        <bk-form-item label="接口人" :required="true">
                            <bk-select :disabled="false" v-model="value" style="width: 100%;"
                                ext-cls="select-custom"
                                ext-popover-cls="select-popover-custom"
                                placeholder="请选择接口人"
                                searchable>
                                <bk-option v-for="option in list"
                                    :key="option.id"
                                    :id="option.id"
                                    :name="option.name">
                                </bk-option>
                            </bk-select>
                        </bk-form-item>
                    </bk-col>
                </bk-row>
                
                <bk-row>
                    <bk-col :span="6">
                        <bk-form-item
                            :label-width="120"
                            label="开始申请时间"
                            :required="true"
                        >
                            <bk-date-picker
                                style="width:100%"
                                v-model="formData.initDateTime"
                                :placeholder="'请选择开始申请时间'"
                                :ext-popover-cls="'custom-popover-cls'"
                            ></bk-date-picker>
                        </bk-form-item>
                    </bk-col>
                    <bk-col :span="6">
                        <bk-form-item label="截止申请时间" :required="true">
                            <bk-date-picker
                                style="width:100%"
                                v-model="formData.initDateTime"
                                :placeholder="'请选择截止申请时间'"
                                :ext-popover-cls="'custom-popover-cls'"
                            ></bk-date-picker>
                        </bk-form-item>
                    </bk-col>
                </bk-row>
                
                <bk-row>
                    <bk-col :span="6">
                        <bk-form-item label="描述信息" :required="true">
                            <bk-input
                                v-model="formData.name"
                                :type="'textarea'"
                                :rows="3"
                                :maxlength="255"
                                placeholder="请输入描述信息"
                            ></bk-input>
                        </bk-form-item>
                        <bk-form-item label="奖项级别" :required="true">
                            <bk-select multiple
                                display-tag
                                v-model="formData.multipleValue"
                                placeholder="请选择奖项级别"
                            >
                                <bk-option v-for="option in list"
                                    :key="option.id"
                                    :id="option.id"
                                    :name="option.name">
                                </bk-option>
                            </bk-select>
                        </bk-form-item>
                    </bk-col>

                    <bk-col :span="6">
                        <bk-form-item label="图片" :required="true">
                            <bk-upload
                                style="height:100%;"
                                ext-cls="uploader"
                                :tip="'只允许上传JPG、PNG'"
                                :with-credentials="true"
                                :url="'https://jsonplaceholder.typicode.com/posts/'"
                            ></bk-upload>
                        </bk-form-item>
                    </bk-col>
                </bk-row>
                
                <!-- /奖项基本信息 -->
                <bk-divider></bk-divider>
                <bk-row>
                    <bk-col :span="12">
                        <bk-form-item label-width="auto"
                            label="评审人(*同级审批为[或审批]，异级审批为[与审批])"
                            :required="true">
                            <div class="form-group">
                                <bk-select style="width:80%"
                                    multiple
                                    display-tag
                                    v-model="formData.multipleValue"
                                    placeholder="请选择评审人"
                                >
                                    <bk-option v-for="option in list"
                                        :key="option.id"
                                        :id="option.id"
                                        :name="option.name">
                                    </bk-option>
                                </bk-select>
                                <bk-button title="添加同级评审人">
                                    <bk-icon type="plus-circle-shape" />
                                </bk-button>
                            </div>
                        </bk-form-item>
                    </bk-col>
                </bk-row>
            </bk-container>
        </bk-form>
    </div>
</template>
<script>
    export default {
        name: 'new-award-form',
        data () {
            return {
                formData: {},
                list: []
            }
        }
    }
</script>
<style>
    @import "./index.css";
</style>
