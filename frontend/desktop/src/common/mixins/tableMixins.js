export const tableMixins = {
    data () {
        return {
            // 提供分页器格式
            pagination: {
                count: 0,
                limit: 10,
                current: 1
            },
            loading: false
        }
    }
}
