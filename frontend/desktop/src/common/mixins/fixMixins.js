/**
 * @file fixMixins
 * @author couriourc
 * @description 修复部分 bug 的函数放置在这里
 */

export default {
    data () {},
    computed: {},
    mounted () {
    },
    methods: {

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
