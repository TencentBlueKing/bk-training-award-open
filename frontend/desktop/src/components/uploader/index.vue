<template>
    <bk-upload :theme="theme"
        v-if="!($attrs['readonly'] && attachFiles.length < 1)"
        :files="attachFiles"
        :limit="limit"
        :tip="$attrs['tip']"
        :with-credentials="true"
        :url="url"
        @on-exceed="handleUploadExceed(limit,attachFiles.length)"
        :ext-cls="$attrs['ext-cls']"
        :multiple="$attrs['multiple']"
        @on-success="handleSuccess"
        :handle-res-code="handleUploadFileRes"
        :header="[
            { name: 'X-CSRFToken',value: cookie }
        ]"
        :class="{
            disabled: $attrs['disabled'],
            readonly: $attrs['readonly']
        }"
        :size="100"
        ref="file-panel"
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
                    const attachFiles = binding.value
                    filePanel.querySelectorAll('.file-item .file-info').forEach((fileItem, index) => {
                        // 已经被绑定就返回
                        if (fileItem.__binded__) {
                            return
                        }
                        fileItem.addEventListener('click', () => {
                            const curFile = attachFiles[index]
                            if (!curFile) {
                                return
                            }
                            // 创建 a 标签
                            const downloadElement = document.createElement('a')
                            downloadElement.style.display = 'none'
                            downloadElement.href = curFile['url']
                            downloadElement.download = curFile['name'] // 下载后文件名
                            document.body.appendChild(downloadElement)
                            downloadElement.click() // 点击下载
                            document.body.removeChild(downloadElement) // 下载完成移除元素
                            window.URL.revokeObjectURL(curFile['url']) // 释放掉blob对象
                        })
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
