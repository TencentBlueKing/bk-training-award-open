/**
 * @file fixMixinx
 * @author couriourc
 * @description 修复部分 bug 的函数放置在这里
 */

export default {
    data () {},
    computed () {},
    mounted () {
        this.adjustTable()
    },
    methods: {
        /**
         * 调整 main 高度 让表格自适应高度变化
         * */
        adjustTable () {
            document.querySelector('.main-content').style.minHeight = '0'
            document.querySelector('.main-content').style.height = '100%'
        },
        /**
         * 标记正在开发中的功能
         * */
        notImplemented (feature) {
            const message = `正在开发: ${feature}`
            alert(message)
            throw new Error(message)
        }
     
    }
}
