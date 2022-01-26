export default {
    data () {
        return {
            remoteData: [],
            pagination: {
                current: 1,
                count: 0,
                limit: 1
            },
            tableDataIsLoading: false,
            tableDataUrl: ''
        }
    },
    methods: {
        /**
         * 获取表格信息
         * */
        handlePageSizeChange (limit) {
            /**
             * 尺寸变化的时候应该让当前页面回到初始状态
             * */
            this.pagination.current = 1
            this.pagination.limit = limit
            this.handleGetPageData(this.pagination.current, limit)
        },
        /**
         * 页面变化的时候获取可申请奖项页面数据
         * */
        handleCurrentChange (current) {
            this.pagination.current = current
            this.handleGetPageData(current, this.pagination.limit)
        },
        /**
         * @param {number} current 当前页面数
         * @param {number} pageSize 当前页面大小数
         * @return {Promise}
         * */
        handleGetPageData (current, pageSize) {
            const { tableDataUrl } = this
            this.tableDataIsLoading = true

            return this.$http.get(tableDataUrl).then(
                res => {
                    this.remoteData = res.data.results
                }
            ).finally(_ => {
                this.tableDataIsLoading = false
            })
        }
    }
}
