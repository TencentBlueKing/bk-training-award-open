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
                    <!--                    <div class="header-user">-->
                    <!--                        <i class="bk-icon icon-user f20 mr5"></i>-->
                    <!--                        {{ user.username || 'Admin' }}-->
                    <!--                    </div>-->
                    <bk-popover theme="light navigation-message" style="margin-left: auto;" placement="bottom" :arrow="false"
                        offset="0, 5" trigger="mouseenter" :tippy-options="{ 'hideOnClick': false }">
                        <div :class="['header-mind',{
                            'active': $route.name === 'mycheck'
                        }]" @click="toCheckview()">
                            <bk-icon class="f20" type="pc" />
                            <div class="pl5 f15">我的审批</div>
                        </div>
                    </bk-popover>
                    <bk-popover theme="light navigation-message" placement="bottom" :arrow="false" offset="0, 5"
                        trigger="mouseenter" :tippy-options="{ 'hideOnClick': false }">
                        <div :class="['header-mind',{
                            'active': $route.name === 'myapply'
                        }]" @click="toMyapply()">
                            <bk-icon class="f20" type="panel-permission" />
                            <div class="pl5 f15">我的申请</div>
                        </div>
                    </bk-popover>
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

    export default {
        name: 'monitor-navigation',
        data () {
            return {
                routerKey: +new Date(),
                systemCls: 'mac',
                nav: {
                    list: generatorNav(),
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
                            label: '退出',
                            func: () => {
                                console.log(window.SITE_URL)
                            }
                        }
                    ]
                },
                lang: {
                    list: []
                }
            }
        },
        computed: {
    ...mapGetters(['mainContentLoading', 'user'])
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
                getUsermanageRetrieveUser().then(_ => {
                    const userStatus = {
                        is_admin: _['data']?.['is_admin'],
                        is_secretary: _['data']?.['is_secretary']
                    }
                    bus.$emit('user-router', userStatus)
                    this.$store.commit('updateUserIdent', userStatus)
                }).finally(_ => {
                    bus.$emit('main-loading', true)
                })
            },
            handleSelect (id, item) {
                this.changeColor()
                this.nav.id = id
                this.$router.push({
                    name: item.pathName
                })
            },
            handleToggle (v) {
                this.nav.toggle = v
            },
            toCheckview () {
                this.tofirstColor()
                this.$router.push({
                    name: 'mycheck'
                })
            },
            toMyapply () {
                this.tofirstColor()
                this.$router.push({
                    name: 'myapply'
                })
            },
            /**
             * 将左侧导航栏中的背景色、字体色、图标色恢复为默认的颜色
             */
            tofirstColor () {
                this.bckcolor = 'rgb(255, 255, 255)'
                this.fontcolor = 'rgb(99, 101, 110)'
                this.iconcolor = 'rgb(99, 101, 110)'
            },
            /**
             * 将左侧导航栏中的背景色、字体色、图标色恢复为选中后的颜色
             */
            changeColor () {
                this.bckcolor = 'linear-gradient(90deg,rgba(63,135,255,1) 0%,rgba(58,132,255,1) 100%)'
                this.fontcolor = '#FFFFFF'
                this.iconcolor = '#FFFFFF'
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
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  font-size: 14px;

  .header-nav {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    padding: 0;
    margin: 0;
  }

  .header-mind {
    color: #768197;
    font-size: 15px;
    position: relative;
    padding: 6px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    margin-right: 8px;
    user-select: none;

    .lang-icon {
      font-size: 20px;
    }

    &.active {
      color: #3271ae;
    }

    &:hover {
      color: #000000;
    }
  }

}

.monitor-navigation-content {
  @mixin scroller;

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
