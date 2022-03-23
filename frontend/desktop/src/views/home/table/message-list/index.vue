<template>
    <div class="message-table">
        <div class="message-content" v-show="messageData.length"
            v-bkloading="{ isLoading: loading ,title: '请稍等,正在为您安放数据' }"
        >
            <message-card v-for="(item,index) in messageData"
                :key="item['id']"
                :message="item"
                @tool-click="handleRead(item,index)"
            ></message-card>
        </div>
        <empty v-show="!messageData.length"></empty>
        <bk-pagination
            :small="true"
            v-show="pagination.count > 2"
            :current.sync="pagination.current"
            :count="pagination.count"
            :limit.sync="pagination.limit"
            @limit-change="handleSetLimit()"
            @change="handleInit()"
        />
    </div>
</template>

<script>
    import { getMessage, putMessage } from '@/api/service/message-service'
    import { formatUsernameAndDisplayName } from '@/common/util'

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
                    count: 0,
                    limit: 10
                }
            }
        },
        computed: {
            messageData (self) {
                return self.messageRemoteData?.map(item => {
                    return {
                        msg_id: item['id'],
                        group_id: item['group_id'],
                        group_name: item['group_name'],
                        action_type: item['action_type'],
                        action_target: item['action_target'],
                        action_username: item['action_username'],
                        action_display_name: item['action_display_name'],
                        action_display_name_for_display: formatUsernameAndDisplayName(item['action_username'], item['action_display_name']),
                        message: item['message'],
                        is_read: item['is_read']
                    }
                }) ?? []
            }
        },
        created () {
            this.handleInit()
        },
        methods: {
            handleInit () {
                this.handleGetPageData()
            },
            handleSetLimit () {
                this.pagination.current = 1
                return this.handleGetPageData()
            },
            handleGetPageData (page = this.pagination.current, size = this.pagination.limit) {
                if (this.loading) {
                    return
                }
                this.loading = true
                return getMessage({
                    page,
                    size
                }).then(response => {
                    this.messageRemoteData = response.data.data
                    this.pagination.count = response.data.count
                }).finally(_ => {
                    this.loading = false
                })
            },
            handleRead ({ msg_id, message }, index) {
                return putMessage({ msg_id }).then(response => {
                    this.messageRemoteData[index]['is_read'] = true
                })
            }
        }

    }
</script>

<style scoped>
.message-table {
  .message-content {
    height: 100%;
    max-height: 400px;
    overflow-y: scroll;
  }
}
</style>
