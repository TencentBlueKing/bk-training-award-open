<template>
    <div class="message-table">
        <div class="message-content" v-show="messageData.length"
            v-bkloading="{ isLoading: loading ,title: '请稍等,正在为您安放数据' }"
        >
            <message-card v-for="item in messageData" :key="item['id']" :message="item"></message-card>
        </div>
        <empty v-if="!messageData.length"></empty>
        <bk-pagination
            small v-else
            :current.sync="pagination.current"
            :count.sync="pagination.count"
            :limit.sync="pagination.limit"
        />
    </div>
</template>

<script>
    import { getMessage } from '@/api/service/message-service'

    export default {
        name: 'message-list',
        components: {
            MessageCard: () => import('@/views/home/MessageCard')
        },
        data () {
            return {
                messageRemoteData: [],
                loading: false,
                pagination: {
                    current: 1,
                    count: 10,
                    limit: 10
                }
            }
        },
        computed: {
            messageData (self) {
                return self.messageRemoteData
            }
        },
        created () {
            this.handleInit()
        },
        methods: {
            handleInit () {
                this.handleGetPageData()
            },
            handleGetPageData (page = this.pagination.current, size = this.pagination.limit) {
                this.loading = true
                if (this.loading) {
                    return
                }
                return getMessage({
                    page,
                    size
                }).then(res => {
                    console.log(res)
                }).finally(_ => {
                    this.loading = false
                })
            }
        }

    }
</script>

<style scoped>
.message-table {
  .message-content {
    max-height: 300px;
    overflow: scroll;
  }
}
</style>
