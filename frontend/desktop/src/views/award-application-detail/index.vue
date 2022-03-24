<template>
    <div class="award-application-detail-container">
        <top-back></top-back>
        <div class="header-controller-panel mt15 mb20">
            <select-search
                style="width: calc(2*118px + 1*8px);font-size: 15px;"
                behavior="simplicity"
                placeholder="请选择奖项"
                type="self"
                :data="awardList"
                :value.sync="value"
                id-key="award_id"
                display-key="award_name"
                :multiple="false"
            ></select-search>
        </div>
        <tabs class="mt15"
            :tab-items="awardApplicationTabItems"
            v-model="workbench"
        >
            <template>
                <!-- 这里取了一下巧，后续改着可能会难受，但是问题应该不大 -->
                <component :is="workbench" :ref="workbench"></component>
            </template>
        </tabs>
    </div>
</template>
<script>

    import { getAwardApplication } from '@/api/service/apply-service'
    import { ING_REVIEW } from '@/constants'
    import { getAvailableAwards } from '@/api/service/award-service'

    export default {
        components: {
        },
        data () {
            return {
                awardApplicationTabItems: [
                    {
                        'tab-name': '申请详情',
                        'tab-key': 'application-detail'
                    }
                ],
                loading: false,
                workbench: 'application-detail',
                value: '',
                remoteData: [],
                awardRemoteList: []
            }
        },
        computed: {
            tableData (self) {
                return self.remoteData?.map(item => {
                    return {
                    
                    }
                }) ?? []
            },
            awardList (self) {
                return self.awardRemoteList?.map(item => {
                    return {
                        award_id: item['id'],
                        award_name: item['award_name']
                    }
                }) ?? []
            }
        },
        created () {
            if (this.$route.query['group_id']) {
                this.$bus.curGlobalGroupId = this.$route.query['group_id']
            }
            this.handleInit()
        },
        methods: {
            handleInit () {
                Promise.all([
                    this.handleGetApplication(),
                    this.handleGetAwardList()
                ])
            },
            handleGetApplication () {
                const awardId = this.$route.query['award_id']
                return getAwardApplication(awardId).then(response => {
                    console.log(response)
                })
            },
            handleGetAwardList () {
                if (this.loading) return
                this.loading = true

                const groupId = this.$route.query['group_id']

                const params = {
                    award_status: ING_REVIEW,
                    group_id: groupId
                }
                return getAvailableAwards(params).then(response => {
                    const pendingStartAwards = response.data
                    this.awardRemoteList = pendingStartAwards.data
                }).finally(_ => {
                    this.loading = false
                })
            },
            handleChangeAwardId () {

            }
            
        }
    }
</script>

<style scoped>
.award-application-detail-container{
  width: 80%;
  margin: 0 auto;
}
</style>
