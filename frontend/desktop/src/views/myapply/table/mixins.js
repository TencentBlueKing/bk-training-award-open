
export const applyTableMixins = {
    data () {
        return {
            pagination: {
                current: 1,
                count: 0,
                limit: 10
            },
            loading: false
        }
    }
}
