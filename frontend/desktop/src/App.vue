<template>
    <div class="monitor-navigation" :class="systemCls">
        <bk-navigation
            :header-title="nav.title"
            :side-title="nav.title"
            :default-open="true"
            :need-menu="true"
            @toggle="handleToggle"
        >
            <template slot="header">

                <div class="monitor-navigation-header">
                    <ol class="header-nav">
                        <bk-breadcrumb>
                            <bk-breadcrumb-item>{{ header.name }}</bk-breadcrumb-item>
                        </bk-breadcrumb>
                    </ol>

                    <div class="top-menu">
                        <div v-for="topMenu in userTopMenu"
                            :key="topMenu.label"
                            :class="['header-mind',{
                                'active': $route.name === topMenu.path
                            }]" @click="topMenu.func"
                        >
                            <div class="pl5 f15">{{ topMenu.label }}</div>
                        </div>
                    </div>

                </div>
            </template>
            <template slot="menu">
                <bk-navigation-menu
                    ref="menu"
                    @select="handleSelect"
                    :default-active="nav.id"
                    :toggle-active="nav.toggle"
                >
                    <bk-navigation-menu-item
                        v-for="item in nav.list"
                        :has-child="item.children && !!item.children.length"
                        :key="item.id"
                        v-bind="item"
                    >
                        <span>{{ item.name }}</span>
                        <div slot="child">
                            <bk-navigation-menu-item
                                v-for="child in item.children"
                                :key="child.id"
                                :default-active="child.active"
                                v-bind="child"
                            >
                                <span>{{ child.name }}</span>
                            </bk-navigation-menu-item>
                        </div>
                    </bk-navigation-menu-item>
                </bk-navigation-menu>
            </template>
            <div class="monitor-navigation-content">
                <main class="main-content" v-bkloading="{ isLoading: mainContentLoading, opacity: 1 }">
                    <router-view :key="routerKey" v-show="!mainContentLoading" />
                </main>
            </div>
            <template slot="footer">
                <div class="monitor-navigation-footer">
                    Copyright © 2012-{{ new Date().getFullYear() }} Tencent BlueKing. All Rights Reserved. 腾讯蓝鲸 版权所有
                </div>
            </template>
        </bk-navigation>
        <app-auth ref="bkAuth"></app-auth>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import { bus } from '@/common/bus'
    import { getUsermanageRetrieveUser } from '@/api/service/group-service'
    import { generatorNav } from '@/router'
    import { MYAPPLY_ROUTE_PATH, MYCHECK_ROUTE_PATH, POWER_CONTROLLER } from '@/constants'

    export default {
        name: 'monitor-navigation',
        data () {
            return {
                routerKey: +new Date(),
                systemCls: 'mac',
                nav: {
                    list: [],
                    id: 'home',
                    toggle: true,
                    submenuActive: false,
                    title: '奖项申报系统'
                },
                header: { name: '' },
                message: {},
                userMenu: {
                    list: [
                        {
                            label: '我的审批',
                            path: MYCHECK_ROUTE_PATH,
                            func: this.toRoute(MYCHECK_ROUTE_PATH)
                        },
                        {
                            label: '我的申请',
                            path: MYAPPLY_ROUTE_PATH,
                            func: this.toRoute(MYAPPLY_ROUTE_PATH)
                        }
                        // {
                        //     label: '注销',
                        //     func: () => {
                        //         clearAllCookie()
                        //         window.location.href = ''
                        //     }
                        // }
                    ]
                },
                lang: {
                    list: []
                }
            }
        },
        computed: {
              ...mapGetters(['mainContentLoading', 'user']),
              userTopMenu (self) {
                const ident = self.$store.getters.ident
                return self.userMenu.list.filter(item => item.path && !POWER_CONTROLLER[item.path][ident]['header-button-hidden'])
              }
        },
        watch: {
            '$route.name': {
                immediate: true,
                handler (newValue) {
                    this.nav.id = newValue
                }
            },
            '$route.meta': {
                immediate: true,
                handler (newValue) {
                    this.header.name = newValue.title || ''
                    document.title = '奖项申报系统-' + newValue.title
                }
            }
        },
        created () {
            const platform = window.navigator.platform.toLowerCase()
            if (platform.indexOf('win') === 0) {
                this.systemCls = 'win'
            }

            bus.$on('main-loading', (value) => {
                this.mainContentLoading = value
            })
        },
        mounted () {
            const self = this
            bus.$on('show-login-modal', data => {
                self.$refs.bkAuth.showLoginModal(data)
            })
            bus.$on('close-login-modal', () => {
                self.$refs.bkAuth.hideLoginModal()
                setTimeout(() => {
                    window.location.reload()
                }, 0)
            })
            this.handleGetUserManageRetrieveUser()
        },
        methods: {
            handleGetUserManageRetrieveUser () {
                bus.$emit('main-loading', true)
                return getUsermanageRetrieveUser().then(_ => {
                    const userStatus = {
                        is_admin: _['data']?.['is_admin'] ?? false,
                        is_secretary: _['data']?.['is_secretary'] ?? false
                    }
                    this.$store.commit('updateUserIdent', userStatus)
                    // 完成权限获取，生成对应路由
                    this.nav.list = generatorNav()
                }).finally(_ => {
                    bus.$emit('main-loading', true)
                })
            },
            handleSelect (id, item) {
                this.nav.id = id
                this.$router.push({
                    name: item.pathName
                })
            },
            handleToggle (v) {
                this.nav.toggle = v
            },
            toRoute (route) {
                return () => this.$router.push({
                    name: route
                })
            }
        }
    }
</script>

<style lang="postcss">
@import './css/reset.css';
@import './css/app.css';
@import "@/css/mixins/scroll.css";

.bk-navigation-title .title-desc {
  user-select: none;
}

.bk-navigation-wrapper .navigation-nav .nav-slider-list {

  -webkit-box-shadow: 0 2px 4px 0 rgba(25, 25, 41, 0.05);
  box-shadow: 0 2px 4px 0 rgba(25, 25, 41, 0.05);
}

.monitor-navigation-header {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  overflow: hidden;
  height: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  justify-content: space-between;

  .header-nav {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    padding: 0;
    margin: 0;
  }

  .top-menu {
    white-space: nowrap;
    display: flex;
    justify-content: center;
    align-items: center;

    .header-mind {
      display: inline-block;

      color: #768197;
      font-size: 15px;
      position: relative;
      padding: 6px;
      margin-right: 8px;
      user-select: none;

      &:hover {
        color: #000000;
      }

      &.active {
        color: #3271ae;
      }

    }
  }

}

.monitor-navigation-content {
  @mixin scroller;
  overflow: scroll;
  padding: 5px 15px 15px 15px;
  font-size: 14px;
  color: #737987;
  height: calc(100% - 84px);
  background: #FFFFFF;
  -webkit-box-shadow: 0 2px 4px 0 rgba(25, 25, 41, 0.05);
  box-shadow: 0 2px 4px 0 rgba(25, 25, 41, 0.05);
  border-radius: 3px;
  border: 1px solid rgba(220, 222, 229, 1);

  .main-content {
    min-height: 600px;
  }
}

.monitor-navigation-footer {
  height: 52px;
  width: 100%;
  margin: 32px 0 0;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  border-top: 1px solid #dcdee5;
  color: #63656e;
  font-size: 12px;
}

</style>
