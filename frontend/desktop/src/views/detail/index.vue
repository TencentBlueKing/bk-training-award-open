<template>
    <div>
        <div class="detail-head">基本信息</div>
        <div>
            <span>
                <div class="input-demo" style="margin-left: 6%;margin-top:1%;width: 23%;">
                    <span class="item-name" style="width: 23%;">奖项名称</span>
                    <bk-input :placeholder="'奖项名称'" :disabled="true" v-model="name" class="item-Info" style="width: 70%;"></bk-input>
                </div>
                <div class="input-demo" style="width: 12%;">
                    <span class="item-name">接口人</span>
                    <bk-input :placeholder="'接口人'" :disabled="true" v-model="manager" class="item-Info"></bk-input>
                </div>
                <div class="input-demo" style="width: 10%;">
                    <span class="item-name">奖项级别</span>
                    <bk-input :placeholder="'奖项级别'" :disabled="true" v-model="awardClass" class="item-Info"></bk-input>
                </div>
                <div class="input-demo" style="width: 18.5%;">
                    <span class="item-name" style="width: 37%;">开始申请时间</span>
                    <bk-input :placeholder="'开始申请时间'" :disabled="true" v-model="startDate" class="item-Info"></bk-input>
                </div>
                <div class="input-demo" style="width: 18.5%;">
                    <span class="item-name">截止时间</span>
                    <bk-input :placeholder="'截止时间'" :disabled="true" v-model="endDate" class="item-Info"></bk-input>
                </div>
            </span>
        </div>
        <div style="margin-left: 6%">
            <div class="second-name">奖项描述</div>
            <div class="describe">
                {{describe}}
            </div>
        </div>
        <bk-divider align="right" style=""></bk-divider>
        <div class="detail-head" style="">申请奖项</div>
        <div style="height:auto;">
            <span class="bottom-detail" style="padding-bottom:0px;float: left">
                <span class="apply-user">申请人</span>
                <bk-input type="text" class="user-input" :input-style="mystyle"></bk-input>
                <span class="apply-user" style="width: 100%;margin-top: 30px;">申请理由</span>
                <bk-input type="textarea" :input-style="mystyle" style="width: 85%;margin-top: 10px" placeholder="请输入描述"></bk-input>
            </span>
            <span class="bottom-detail" style="height:250px;">
                <span class="apply-user" style="width: 100%;">申请材料</span>
                <span class="file-upload">
                    <bk-upload
                        :tip="'只允许上传JPG、PNG、JPEG、ZIP的文件'"
                        :with-credentials="true"
                        :handle-res-code="handleRes"
                        @on-success="testSuccess"
                        @on-progress="testProgress"
                        @on-done="testDone"
                        @on-error="testErr"
                        :url="'https://jsonplaceholder.typicode.com/posts/'"
                        style="margin-top: 20px"
                    ></bk-upload>
                </span>

            </span>
        </div>
        <div style="margin-left: 35%">
            <bk-button class="mr10">发起申请</bk-button>
            <bk-button class="mr10">保存草稿</bk-button>
            <bk-button class="mr10">取消</bk-button>
        </div>
    </div>
</template>

<script>
    import { bkInput, bkDivider, bkButton } from 'bk-magic-vue'
    export default {
        components: {
            bkInput,
            bkDivider,
            bkButton
        },
        data () {
            return {
                startDate: '2018-10-01-13.00',
                awardClass: '校级',
                manager: '大声道',
                endDate: '2018-10-01-12.00',
                name: '全国大学生数学建模大赛',
                searchText: '测试',
                describe: '全国大学生数学建模大赛 全国大学生数学建模大赛 全国大学生数学建模大赛 全国大学生数学建模大赛',
                mystyle: {
                    width: '100%',
                    backgroundColor: 'rgb(250, 251, 253)'
                }
            }
        },
        created () {
        },
        methods: {
            testSuccess (file, fileList) {
                console.log(file, fileList, 'success')
            },
            testProgress (e, file, fileList) {
                console.log(e, file, fileList, 'progress')
            },
            testDone () {
                console.log('done')
            },
            testErr (file, fileList) {
                console.log(file, fileList, 'error')
            },
            handleRes (response) {
                if (response.id) {
                    return true
                }
                return false
            }
        }
    }
</script>

<style scoped>
    @import './index.css';
</style>
