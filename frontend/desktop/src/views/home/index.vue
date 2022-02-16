<template>
    <div class="home-container">
        <Divider>
            <bk-link>可申请奖项</bk-link>
        </Divider>
        <div class="available-bar mt10 mb10 bk-slide-fade-left p5">
            <AwardCardContainer v-for="award in availableAwardList" :key="award.id" :award="award"></AwardCardContainer>
            <bk-exception v-if="!availableAwardList.length" class="exception-wrap-item exception-part" type="empty"
                scene="part"></bk-exception>
        </div>
        <Divider>
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
                return self.historyAwardListRemoteData
            },
            availableAwardList (self) {
                return self.availableAwardListRemoteData
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
            handleGetAvailableAwards () {
                return this.$http.get('get_available_awards/', {
                    params: {
                        page: 1,
                        size: 4
                    }
                }).then(res => {
                    this.availableAwardListRemoteData = res['data']['data']
                    return res
                })
            },
            handleGetApplyedAwards () {
                return this.$http.get('get_applyed_awards/', {
                    params: {
                        page: 1,
                        size: 4
                    }
                }).then(res => {
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
