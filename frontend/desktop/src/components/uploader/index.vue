<template>
    <bk-upload :theme="theme"
        ref="file-panel"
        :size="100"
        :url="url"
        :files="attachFiles"
        :limit="limit"
        :tip="$attrs['tip']"
        :with-credentials="true"
        :ext-cls="$attrs['ext-cls']"
        :multiple="$attrs['multiple']"
        :handle-res-code="handleUploadFileRes"
        :header="[
            { name: 'X-CSRFToken',value: cookie }
        ]"
        :class="{
            disabled: $attrs['disabled'],
            readonly: $attrs['readonly']
        }"
        @on-exceed="handleUploadExceed(limit,attachFiles.length)"
        @on-success="handleSuccess"

        v-if="!($attrs['readonly'] && attachFiles.length < 1)"
        v-download="attachFiles"
    ></bk-upload>
    <empty v-else
        style="border: solid 1px #C4C6CC;"
    >
    </empty>
</template>
<script>
    import cookie from 'cookie'

    export default {
        name: 'uploader',
        directives: {
            download: {
                componentUpdated (filePanel, binding) {
                    // 获取绑定的文件
                    const attachFiles = binding.value
                    // 下载函数
                    function download (index) {
                        return () => {
                            const curFile = attachFiles[index]
                            if (!curFile) {
                                return
                            }
                            // 将协议替换为空，这样下载的时候协议会
                            const httpReg = /^http:/
                            // 创建 a 标签
                            const downloadElement = document.createElement('a')
                            downloadElement.style.display = 'none'
                            downloadElement.href = curFile['url'].replace(httpReg, '')
                            downloadElement.target = '_blank'
                            downloadElement.download = curFile['name'] // 下载后文件名
                            document.body.appendChild(downloadElement)
                            downloadElement.click() // 点击下载
                            document.body.removeChild(downloadElement) // 下载完成移除元素
                        }
                    }
                    [
                        ...filePanel.querySelectorAll('.file-item .file-info'),
                        ...filePanel.querySelectorAll('.file-item .file-icon')
                    ].forEach((fileItem, index) => {
                        // 已经被绑定就返回
                        if (fileItem.__binded__) {
                            return
                        }
                        fileItem.title = '点击下载'
                        fileItem.addEventListener('click', download(index))
                        // 标记已经被绑定
                        fileItem.__binded__ = true
                    })
                }
            }
        },
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
<style>

.file-wrapper {
  max-height: 200px;
  overflow-y: scroll;
}

.file-item .file-info {
  cursor: pointer;
}

.disabled {
  &::after {
    content: "";
    z-index: 1000;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    user-select: none;
    cursor: not-allowed;
    background-color: #FAFBFD;
    opacity: 20%;
  }
}

.readonly {
  .file-wrapper {
    display: none !important;
  }

  .all-file .file-item .close-upload {
    display: none !important
  }
}
</style>
