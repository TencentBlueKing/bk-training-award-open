<template>
    <div class="home-container">
        <div class="head-panel">
            <div class="header-main">
                <header-nav style="background: var(--gradient-orange-red);"
                    @click="headerTrigger($store.state['ROUTE_TABLE']['GROUP_MANAGER_ROUTE_PATH'])"
                >
                    <bk-icon slot="top-icon" name="sitemap"></bk-icon>
                    我的小组
                </header-nav>
                <header-nav style="background: var(--gradient-blue);"
                    @click="headerTrigger($store.state['ROUTE_TABLE']['AWARD_FORM_ROUTE_PATH'],{
                        query: {
                            type: 'create'
                        }
                    })"
                >
                    <bk-icon slot="top-icon" name="sitemap"></bk-icon>
                    创建奖项
                </header-nav>
                <header-nav style="background: var(--gradient-orange-pink);"
                    @click="headerTrigger($store.state['ROUTE_TABLE']['MYAPPLY_ROUTE_PATH'])"
                >
                    <bk-icon slot="top-icon" name="sitemap"></bk-icon>
                    我的申请
                </header-nav>
                <header-nav style="background: var(--gradient-green);"
                    @click="headerTrigger($store.state['ROUTE_TABLE']['AWARD_MANAGER_ROUTE_PATH'])"
                >
                    <bk-icon slot="top-icon" name="sitemap"></bk-icon>
                    奖项列表
                </header-nav>
                <header-nav style="background: var(--gradient-purple);"
                    @click="headerTrigger($store.state['ROUTE_TABLE']['MYCHECK_ROUTE_PATH'])"
                >
                    <bk-icon slot="top-icon" name="sitemap"></bk-icon>
                    审批记录
                </header-nav>
            </div>
        </div>
        <div class="footer-panel">
            <tabs style="width: calc(5*118px + 4*8px);"
                :tab-items="[{
                    'tab-name': '可申请奖项',
                    'tab-key': 'available_award'
                },{
                    'tab-name': '奖项审批',
                    'tab-key': 'available_approval'
                }]"
                v-model="workbenchCurIndex"
            >
                <tempalte>
                    <div v-show="workbenchCurIndex === 'available_award'">
                        <bk-table
                            :data="tableData"
                            :outer-border="false"
                            :header-border="false"
                            :header-cell-style="{ background: '#fff' }"
                        >
                            <bk-table-column type="index" label="序列" width="60"></bk-table-column>
                        </bk-table>
                    </div>
                    <div v-show="workbenchCurIndex === 'available_approval'">
                        <bk-table
                            :data="tableData"
                            :outer-border="false"
                            :header-border="false"
                            :header-cell-style="{ background: '#fff' }"
                        >
                            <bk-table-column type="index" label="序列" width="60"></bk-table-column>
                            <bk-table-column type="index" label="序列" width="60"></bk-table-column>
                        </bk-table>
                    </div>
                </tempalte>
            </tabs>
            <tabs style="width: 370px"
                :tab-items="[{
                    'tab-name': '消息记录',
                    'tab-key': 'message-record'
                }]"
            >
                <bk-link slot="right-controller" underline theme="primary">一键已读</bk-link>
                <template>
                    <message-card></message-card>
                </template>
            </tabs>
            <div class="cartoon">
                <cartoon-robot>
                    <span>{{grant}}，{{$store.state.user['username']}}</span>
                </cartoon-robot>
            </div>

        </div>
    </div>
</template>
<script>
    export default {
        name: 'Home',
        components: {
            MessageCard: () => import('@/views/home/MessageCard'),
            HeaderNav: () => import('@/views/home/HeaderNav'),
            Tabs: () => import('@/components/Tabs'),
            CartoonRobot: () => import('@/components/cartoon-robot')

        },
        data () {
            return {
                workbenchCurIndex: 'available_award',
                remoteData: []
            }
        },
        computed: {
            tableData (self) {
                return self.remoteData
            },
            grant () {
                const now = (new Date()).getHours()
                if (now > 0 && now <= 6) {
                    return '午夜好'
                }
                if (now > 6 && now <= 11) {
                    return '早上好'
                }
                if (now > 11 && now <= 14) {
                    return '中午好'
                }
                if (now > 14 && now <= 18) {
                    return '下午好'
                }
                return '晚上好'
            }

        },
        created () {
            this.handleInit()
        },
        methods: {
            handleInit () {
                Promise.all([])
            },
            headerTrigger (routeName, config = {}) {
                this.$router.push({
                    name: routeName,
                    ...config
                })
            }
            /**
             * 请求区域开始
             * */
        }

    }
</script>
<style lang="postcss" scoped>
.home-container {
  --gradient-orange-red: linear-gradient(89.69deg, #F39034 2.03%, #FF2727 99.73%);
  --gradient-blue: linear-gradient(270deg, #003AD2 0%, #0097EC 100%);
  --gradient-orange-pink: linear-gradient(89.69deg, #FF4433 2.03%, #EC008C 99.73%);
  --gradient-green: linear-gradient(270.23deg, #00A843 0.19%, #1FD071 99.8%);
  --gradient-purple: linear-gradient(269.97deg, #5900C9 0.02%, #9852F0 99.98%);
  height: inherit;

  .head-panel {
    display: flex;
    justify-content: center;
    min-height: 35%;
    overflow-x: scroll;
    align-items: center;
    flex: 1;

    .header-main {
      display: flex;
      align-items: center;
      justify-content: center;

    }
  }

  .footer-panel {
    min-height: 50%;
    display: flex;
    flex: 1;
    justify-content: space-around;
    width: inherit;

    .controller-panel {
      height: 385px;
      width: 802px;
      background-color: #FFFFFF;
      border-radius: 20px;
      box-shadow: 0 4px 90px rgba(163, 171, 185, 0.24);
    }

    .message-panel {
      width: 391px;
      background-color: #FFFFFF;
      border-radius: 20px;
      box-shadow: 0 4px 90px rgba(163, 171, 185, 0.24);
    }

    .cartoon {
      width: 391px;

    }
  }
}
</style>
