<template>
    <div class="home-container">
        <Divider @click="toGetMoreCanAvailableAward()">
            <bk-link>可申请奖项</bk-link>
        </Divider>
        <div class="available-bar mt10 mb10 bk-slide-fade-left p5">
            <AwardCardContainer v-for="award in availableAwardList" :key="award.id" :award="award"></AwardCardContainer>
            <bk-exception v-if="!availableAwardList.length" class="exception-wrap-item exception-part" type="empty"
                scene="part"></bk-exception>
        </div>
        <Divider @click="toGetMoreAppliedAward()">
            <bk-link>历史获得奖项</bk-link>
        </Divider>
        <div class="available-bar mt10 bk-slide-fade-left p5">
            <AwardCardContainer v-for="award in historyAwardList" :key="award.id" :award="award"></AwardCardContainer>
            <bk-exception v-if="!historyAwardList.length" class="exception-wrap-item exception-part" type="empty"
                scene="part"></bk-exception>
        </div>
    </div>
</template>
<script>
    import { fixMixins } from '../../common/mixins'
    import { getAppliedAwards, getAvailableAwards } from '@/api/service/award-service'
    import { AWARD_APPROVAL_STATE_EN_MAP, AWARD_APPROVAL_STATE_MAP } from '@/constants'

    export default {
        name: 'Home',
        components: {
            AwardCardContainer: () => import('./components/AwardCard'),
            Divider: () => import('./components/Divider')
        },
        mixins: [fixMixins],
        data () {
            return {
                historyAwardListRemoteData: [],
                availableAwardListRemoteData: []
            }
        },
        computed: {
            historyAwardList (self) {
                console.log(self.availableAwardList)
                return self.historyAwardListRemoteData
            },
            availableAwardList (self) {
                if (!self.availableAwardListRemoteData || !self.availableAwardListRemoteData.map) {
                    return []
                }

                return self.availableAwardListRemoteData.map(item => {
                    return {
                        ...item,
                        approval_state_en: AWARD_APPROVAL_STATE_EN_MAP[item['approval_state']],
                        approval_state: AWARD_APPROVAL_STATE_MAP[item['approval_state']]
                    }
                })
            }
        },
        created () {
            this.handleInit()
        },
        mounted () {
            this.adjustTable()
        },
        methods: {
            handleInit () {
                Promise.all([
                    this.handleGetAvailableAwards(),
                    this.handleGetApplyedAwards()
                ])
            },
            toGetMoreAppliedAward () {
                return this.$router.push({
                    name: 'myapply'
                })
            },
            toGetMoreCanAvailableAward () {
                this.$router.push({
                    name: 'canawards'
                })
            },
            /**
             * 请求区域开始
             * */
            handleGetAvailableAwards () {
                return getAvailableAwards(1, 4).then(res => {
                    this.availableAwardListRemoteData = res['data']['data']
                    return res
                })
            },
            handleGetApplyedAwards () {
                return getAppliedAwards(1, 4).then(res => {
                    return res
                })
            }
        }

    }
</script>
<style scoped>
.home-container {

  overflow-y: scroll;
  height: inherit;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    height: 5px;
    border-radius: 2px;
    background-color: #e6e9ea;
  }

  .available-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    width: inherit;
    overflow-x: scroll;

    &::-webkit-scrollbar {
      width: 2px;
    }

    &::-webkit-scrollbar-thumb {
      height: 1px;
      border-radius: 2px;
      background-color: #e6e9ea;
    }
  }
}

</style>
