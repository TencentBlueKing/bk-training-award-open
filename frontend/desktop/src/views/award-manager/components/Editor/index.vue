<template>
    <div>
        <div ref="editor" id="editor">
            <!-- 需要注入的内容 -->
            <div v-html="intelContent"></div>
        </div>
    </div>
</template>

<script>
    import Editor from 'wangeditor'
    import xss from 'xss'
    export default {
        name: 'editor',
        components: {
        },
        props: {
            content: {
                type: String
            }
        },
        data () {
            return {
                editorInstance: null
            }
        },
        computed: {
            intelContent: {
                get (self) {
                    console.log('self.content', self.content)
                    return xss(self.content)
                }
            }
        },
        mounted () {
            this.$nextTick(this.handleInit)
        },
        beforeDestroy () {
            // 销毁编辑器

        },
        methods: {
            handleInit () {
                const editorPanel = this.$refs['editor']
                // 用于初始化
                const editorInstance = new Editor(editorPanel)
                this.editorInstance = editorInstance
                this.handleOptionEditor()
                editorInstance.create()
            },
            handleOptionEditor () {
                // 配置功能相关
                this.handleSetMenu()
                // 配置图标相关
            },
            handleSetMenu () {
                this.editorInstance.config.excludeMenus = [
                    'emoticon',
                    'video',
                    'todo',
                    'list',
                    'code',
                    'fontName'
                ]
            },
            getHTML () {
                return xss(this.editorInstance.txt.html())
            }

        }
    }
</script>

<style>

</style>
