<template>
    <div class="uploader-container">
        <bk-upload :file="attachFiles"
            :theme="theme"
            :limit="limit"
            :tip="'只允许上传JPG、PNG、JPEG、ZIP的文件'"
            :with-credentials="true"
            :custom-request="handleUploder"
            @on-exceed="handleUploadExceed(limit,files.length)"
            @on-done="handleUploadDone"
            :ext-cls="$attrs['ext-cls']"
        ></bk-upload>
    </div>
</template>
<script>
    import cookie from 'cookie'

    export default {
        name: 'uploader',
        model: {
            prop: 'attachFiles',
            event: 'update'
        },
        props: {
            theme: {
                type: String,
                default: () => 'draggable'
            },
            limit: {
                type: Number,
                default: () => 1
            },
            attachFiles: {
                type: Array,
                default: () => []
            },
            url: {
                type: String,
                default: () => '/bk_api/upload/'
            }
        },
        data () {
            return {
                cookie: ''
            }
        },
        computed: {
            EXTERNAL_HEADERS () {
                return {
                    name: 'X-CSRFToken',
                    value: this.cookie
                }
            }
        },
        mounted () {
            this.cookie = cookie.parse(document.cookie)['csrftoken']
        },
        methods: {
            handleUploadFileRes (response) {
                if (response.result) {
                    this.$emit('result')
                    this.$emit('update:attachFiles')
                }
            },
            /**
             * 超出选择数量
             * */
            handleUploadExceed (limit, currentFileLength) {
                this.messageWarn(`限制选择${limit}个，当前已选择${currentFileLength}`)
            },
            handleUploadDone (fileList) {
                console.log('fileList', fileList)
                console.log('this.files', this.files)
            },
            handleUploder ({ fileObj }) {
                console.log(fileObj)
                const form = new FormData()
                form.append('upload_file', fileObj.origin)
                console.log('form', form)
                return this.$http.post(this.url, form).then(res => {
                })
            }

        }
    }
</script>
