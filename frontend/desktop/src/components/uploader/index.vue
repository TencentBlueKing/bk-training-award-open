<template>
    <bk-upload :theme="theme"
        :files="attachFiles"
        :limit="limit"
        :tip="$attrs['tip']"
        :with-credentials="true"
        :url="url"
        @on-exceed="handleUploadExceed(limit,attachFiles.length)"
        :ext-cls="$attrs['ext-cls']"
        :multiple="$attrs['multiple']"
        :disabled="$attrs['disabled']"
        @on-success="handleSuccess"
        :handle-res-code="handleUploadFileRes"
        :header="[
            { name: 'X-CSRFToken',value: cookie }
        ]"
    ></bk-upload>
</template>
<script>
    import cookie from 'cookie'
    import { postUpload } from '@/api/service/common-service'

    export default {
        name: 'uploader',
        model: {
            prop: 'attachFiles',
            event: 'change'
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
                default: () => {
                    if (process.env.NODE_ENV === 'development') {
                        return '/bk_api/upload/'
                    }
                    return 'upload/'
                }
            }
        },
        data () {
            return {
                cookie: '',
                files: []
            }
        },
        mounted () {
            this.cookie = cookie.parse(document.cookie)['csrftoken']
        },
        methods: {
            handleUploadFileRes (response) {
                return response.result
            },
            /**
             * 超出选择数量
             * */
            handleUploadExceed (limit, currentFileLength) {
                this.messageWarn(`限制选择${limit}个，当前已选择${currentFileLength}`)
            },
            handleUploder ({ fileObj }) {
                const form = new FormData()
                form.append('upload_file', fileObj.origin)
                return postUpload(form).then(res => {
                    this.handleUploadFileRes(res, fileObj)
                }).catch(_ => {
                    this.messageError('上传失败')
                })
            },
            handleSuccess (file, fileList) {
                const attachFileList = fileList.map(item => {
                    const responseData = item['responseData']['data']
                    return {
                        ...responseData,
                        url: responseData['path']
                    }
                })
                this.$emit('change', attachFileList)
            }
        }
    }
</script>