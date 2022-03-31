<template>
    <div class="approval-list-container">
        <bk-container :col="6">
            <bk-row>
                <bk-col :span="3">奖项名称</bk-col>
                <bk-col :span="3">状态</bk-col>
            </bk-row>

        </bk-container>
    </div>
</template>
<script>
    import { MYAPPLY_ENDED_APPROVAL } from '@/constants'
    import { getAwardApproval } from '@/api/service/apply-service'

    export default {
        name: 'approval-list',
        data () {
            return {
            }
        },
        created () {
            this.handleInit()
        },
        methods: {
            handleInit () {
                Promise.all(
                    [this.handleGetPendingApproval()]
                )
            },
            handleGetPendingApproval () {
                const groupId = this.$route.query['group_id']
                if (!groupId) {
                    this.messageWarn('出错了')
                    return
                }
                if (this.loading) return
                this.loading = true
                const params = {
                    page: 1,
                    size: 1,
                    group_id: groupId,
                    approval_status: MYAPPLY_ENDED_APPROVAL
                }
                return getAwardApproval(params).then(response => {
                }).finally(_ => {
                    this.loading = false
                })
            }
        }
    }
</script>
