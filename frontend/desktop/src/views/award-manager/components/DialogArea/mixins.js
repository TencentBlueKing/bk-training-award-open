export const dialogMixins = {
    data () {
        return {
            visible: false
        }
    },
    created () {
        this.notImplemented = (feature) => {
            const message = `正在开发: ${feature}`
            alert(message)
            throw new Error(message)
        }
    },
    methods: {
        show () {
            this.visible = true
        },
        hidden () {
            this.visible = false
        }
    }
}
