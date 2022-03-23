<template>
    <div class="home-container">
        <div class="head-panel">
            <div class="header-main">
                <header-nav
                    v-for="nav in headerNavList"
                    :key="nav.title"
                    :style="nav.style"
                    @click="headerTrigger(...nav.routerParams())"
                    :description="nav.description"
                >
                    <span>{{ nav.title }}</span>
                </header-nav>
            </div>
        </div>
        <div class="footer-panel">
            <tabs style="width: calc(8*118px + 7*8px);"
                :tab-items="workbenchTabItems"
                v-model="workbenchCurIndex"
            >
                <template>
                    <component :is="workbenchCurIndex" :ref="workbenchCurIndex"></component>
                </template>
            </tabs>
            <tabs style="width: 370px"
                :tab-items="messageTabItems"
                class="mr10 ml10"
            >
                <bk-link slot="right-controller"
                    theme="primary"
                    :underline="true"
                    @click="handleAllAns($refs['message-list'])"
                >
                    <!--                    一键已读-->
                </bk-link>
                <template>
                    <message-list ref="message-list"></message-list>
                </template>
            </tabs>
            <div class="cartoon">
                <cartoon-robot>
                    <span>{{ grant }}，{{ $store.state.user['username'] }}</span>
                </cartoon-robot>
            </div>

        </div>
    </div>
</template>
<script>

    import { AWARD_TYPE_CREATE, AWARD_TYPE_ROUTE_KEY } from '@/constants'

    export default {
        name: 'Home',
        components: {
            MessageList: () => import('@/views/home/table/message-list'),
            GroupApproval: () => import('@/views/home/table/group-approval'),
            AwardApproval: () => import('@/views/home/table/award-approval'),
            ApplicableAward: () => import('@/views/home/table/applicable-award'),
            HeaderNav: () => import('@/views/home/HeaderNav'),
            Tabs: () => import('@/components/Tabs'),
            CartoonRobot: () => import('@/components/cartoon-robot')
        },
        data (self) {
            return {
                headerNavList: [
                    { style: 'background: var(--gradient-orange-red);',
                      description: '创建小组、成员管理',
                      title: '我的小组',
                      routerParams: () => [self.$store.state['ROUTE_TABLE']['GROUP_MANAGER_ROUTE_PATH']] },
                    { style: 'background: var(--gradient-blue);',
                      description: '为您的小组创建奖项',
                      title: '创建奖项',
                      routerParams: () => [self.$store.state['ROUTE_TABLE']['AWARD_FORM_ROUTE_PATH'], {
                          query: { [AWARD_TYPE_ROUTE_KEY]: AWARD_TYPE_CREATE }
                      }] },
                    { style: 'background: var(--gradient-orange-pink);',
                      description: '查看申请信息及申请状态',
                      title: '我的申请',
                      routerParams: () => [self.$store.state['ROUTE_TABLE']['MYAPPLY_ROUTE_PATH']] },
                    { style: 'background: var(--gradient-green);',
                      description: '查看创建的奖项',
                      title: '奖项列表',
                      routerParams: () => [self.$store.state['ROUTE_TABLE']['AWARD_MANAGER_ROUTE_PATH']] },
                    { style: 'background: var(--gradient-purple);',
                      description: '审批入组、审批奖项以及审批记录',
                      title: '我的审批',
                      routerParams: () => [self.$store.state['ROUTE_TABLE']['MYCHECK_ROUTE_PATH']] }
                ],
                workbenchTabItems: [
                    {
                        'tab-name': '可申请奖项',
                        'tab-key': 'applicable-award'
                    }, {
                        'tab-name': '奖项审批',
                        'tab-key': 'award-approval'
                    },
                    {
                        'tab-name': '小组审批',
                        'tab-key': 'group-approval'
                    }
                ],
                workbenchCurIndex: 'applicable-award',
                messageTabItems: [{
                    'tab-name': '消息记录',
                    'tab-key': 'message-record'
                }]
            }
        },
        computed: {
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
            },
            headerTrigger (routeName, config = {}) {
                this.$router.push(Object.assign({
                    name: routeName
                }, config || {}))
            },
            handleAllAns (messageList) {
                if (!messageList.length) {
                    this.messageWarn('消息记录为空')
                }
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
    justify-content: space-around;
    width: inherit;

    .controller-panel {
      height: 385px;
      width: 900px;
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
      width: 280px;
      transform: translateY(69px);
    }
  }
}
</style>
