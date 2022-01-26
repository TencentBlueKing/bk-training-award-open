<template>
    <div class="monitor-navigation" :class="systemCls">
        <bk-navigation
            :header-title="nav.id"
            :side-title="nav.title"
            :default-open="true"
            :navigation-type="'top-bottom'"
            :need-menu="true"
            @toggle="handleToggle">
            <template slot="header">
                <div class="monitor-navigation-header">
                    <ol class="header-nav">
                        <bk-popover theme="light navigation-message" :arrow="false" offset="0, -5" placement="bottom" :tippy-options="{ 'hideOnClick': false, flipBehavior: ['bottom'] }">
                            <bk-breadcrumb>
                                <bk-breadcrumb-item v-for="(item) in header.list" :key="item.id">{{item.name}}</bk-breadcrumb-item>
                            </bk-breadcrumb>
                        </bk-popover>
                    </ol>
                    <bk-popover theme="light navigation-message" style="margin-left: auto;" placement="bottom" :arrow="false" offset="0, 5" trigger="mouseenter" :tippy-options="{ 'hideOnClick': false }">
                        <div class="header-mind" @click="toCheckview()">
                            <bk-icon type="pc" />
                            <div style="padding-left: 5px;font-size: 15px;color: #96A2B9;">我的审批</div>
                        </div>
                    </bk-popover>
                    <bk-popover theme="light navigation-message" placement="bottom" :arrow="false" offset="0, 5" trigger="mouseenter" :tippy-options="{ 'hideOnClick': false }">
                        <div class="header-mind" @click="toMyapply()">
                            <bk-icon type="panel-permission" />
                            <div style="padding-left: 5px;font-size: 15px;color: #96A2B9;">我的申请</div>
                        </div>
                    </bk-popover>
                    <bk-popover theme="light navigation-message" :arrow="false" offset="-20, 10" placement="bottom-start" :tippy-options="{ 'hideOnClick': false }">
                        <div class="header-user">
                            {{user.username || 'admin'}}
                            <i class="bk-icon icon-down-shape"></i>
                        </div>
                        <template slot="content">
                            <ul class="monitor-navigation-admin">
                                <li class="nav-item" v-for="userItem in userMenu.list" :key="userItem.label">
                                    <span @click="userItem.func()">{{userItem.label}}</span>
                                </li>
                            </ul>
                        </template>
                    </bk-popover>
                </div>
            </template>
            <template slot="menu">
                <bk-navigation-menu
                    ref="menu"
                    @select="handleSelect"
                    :default-active="nav.id"
                    :toggle-active="nav.toggle"
                    :item-active-bg-color="bckcolor"
                    :item-active-color="fontcolor"
                    :item-child-icon-active-color="iconcolor"
                    :item-active-icon-color="iconcolor">
                    <bk-navigation-menu-item
                        v-for="item in nav.list"
                        :has-child="item.children && !!item.children.length"
                        :key="item.id"
                        v-bind="item">
                        <span>{{item.name}}</span>
                        <div slot="child">
                            <bk-navigation-menu-item
                                v-for="child in item.children"
                                :key="child.id"
                                :default-active="child.active"
                                v-bind="child">
                                <span>{{child.name}}</span>
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
                    Copyright © 2012-{{new Date().getFullYear()}} Tencent BlueKing. All Rights Reserved. 腾讯蓝鲸 版权所有
                </div>
            </template>
        </bk-navigation>
        <app-auth ref="bkAuth"></app-auth>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'

    import { bus } from '@/common/bus'

    export default {
        name: 'monitor-navigation',
        data () {
            return {
                routerKey: +new Date(),
                systemCls: 'mac',
                bckcolor: 'linear-gradient(90deg,rgba(63,135,255,1) 0%,rgba(58,132,255,1) 100%)',
                fontcolor: '#FFFFFF',
                iconcolor: '#B0BDD5',
                nav: {
                    list: [
                        {
                            id: 'home',
                            name: '奖项中心',
                            icon: 'icon-dashboard',
                            children: [
                                {
                                    id: 'home1',
                                    name: '可申报奖项',
                                    icon: 'icon-star',
                                    pathName: 'canawards',
                                    active: true
                                }
                            ]
                        },
                        {
                            id: 'manager',
                            name: '管理中心',
                            icon: 'icon-tree-module-shape',
                            children: [
                                {
                                    id: 'group-manager',
                                    name: '组管理',
                                    icon: 'icon-sitemap',
                                    pathName: 'group-manager'
                                },
                                {
                                    id: 'award-manager',
                                    name: '奖项管理',
                                    icon: 'icon-data',
                                    pathName: 'award-manager'
                                }
                            ]
                        }
                    ],
                    id: 'home1',
                    toggle: true,
                    submenuActive: false,
                    title: '奖项申报'
                },
                header: {
                    list: [
                        {
                            name: '',
                            id: 1,
                            show: true
                        }
                    ]
                },
                message: {
                },
                userMenu: {
                    list: [
                        {
                            label: '退出',
                            func: () => {
                                console.log()
                            }
                        }
                    ]
                },
                lang: {
                    list: [
                    ]
                }
            }
        },
        computed: {
            ...mapGetters(['mainContentLoading', 'user']),
            curHeaderNav () {
                return this.header.list[this.header.active] || {}
            }
        },
        created () {
            const platform = window.navigator.platform.toLowerCase()
            if (platform.indexOf('win') === 0) {
                this.systemCls = 'win'
            }
            console.log(this.user)
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
        },
        methods: {
            handleSelect (id, item) {
                console.log(item)
                this.changeColor()
                this.header.list[0].name = item.name // 提示用户此时页面的位置
                this.nav.id = id
                console.info(`你选择了${id}`)
                this.$router.push({
                    name: item.pathName
                })
            },
            handleToggle (v) {
                this.nav.toggle = v
            },
            toCheckview () {
                this.tofirstColor()
                this.header.list[0].name = '我的审核' // 提示用户此时页面的位置
                console.log('去我的审核')
                this.$router.push({
                    name: 'mycheck'
                })
            },
            toMyapply () {
                this.tofirstColor()
                this.header.list[0].name = '我的申请' // 提示用户此时页面的位置
                console.log('去我的申请页面')
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
        .header-nav-item {
            list-style: none;
            height: 50px;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            margin-right: 40px;
            color: #96A2B9;
            min-width: 56px;
            &.item-active {
                color: #fff !important;
            }
            &:hover {
                cursor: pointer;
                color: #d3d9e4;
            }
        }
        .header-title {
            color: #63656E;
            font-size: 16px;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            margin-left: -6px;
        }
        .header-title-icon {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            width: 28px;
            height: 28px;
            font-size: 28px;
            color: #3a84ff;
            cursor: pointer;
        }
        .header-select {
            width: 240px;
            margin-left: auto;
            margin-right: 34px;
            border: none;
            background: #252f43;
            color: #d3d9e4;
            -webkit-box-shadow: none;
            box-shadow: none;
        }
        .header-mind {
            color: #768197;
            font-size: 15px;
            position: relative;
            height: 32px;
            width: 100px;
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
            &:hover {
                background: -webkit-gradient(linear,right top, left top,from(rgba(37,48,71,1)),to(rgba(38,50,71,1)));
                background: linear-gradient(270deg,rgba(37,48,71,1) 0%,rgba(38,50,71,1) 100%);
                border-radius: 50%;
                cursor: pointer;
                color: #d3d9e4;
            }
            .lang-icon {
                font-size:20px;
            }
        }
        .header-mind-mark {
            position: absolute;
            right: 8px;
            top: 8px;
            height: 7px;
            width: 7px;
            border: 1px solid #27334C;
            background-color: #EA3636;
            border-radius: 100%
        }
        .header-help {
            color: #768197;
            font-size: 16px;
            position: relative;
            height: 32px;
            width: 32px;
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
            &:hover {
                background: -webkit-gradient(linear,right top, left top,from(rgba(37,48,71,1)),to(rgba(38,50,71,1)));
                background: linear-gradient(270deg,rgba(37,48,71,1) 0%,rgba(38,50,71,1) 100%);
                border-radius: 100%;
                cursor: pointer;
                color: #d3d9e4;
            }
        }
        .header-user {
            height: 100%;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
            color: #96A2B9;
            margin-left: 8px;
            &:hover {
                cursor: pointer;
                color: #d3d9e4;
            }
            .bk-icon {
                margin-left: 5px;
                font-size: 12px;
            }
        }
    }
    .monitor-navigation-content {
        padding: 5px 15px 15px 15px;
        font-size: 14px;
        color: #737987;
        height: calc(100% - 84px);
        background: #FFFFFF;
        -webkit-box-shadow: 0px 2px 4px 0px rgba(25,25,41,0.05);
        box-shadow: 0px 2px 4px 0px rgba(25,25,41,0.05);
        border-radius: 2px;
        border: 1px solid rgba(220,222,229,1);
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
    .monitor-navigation-message {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -ms-flex-direction: column;
        flex-direction: column;
        width: 360px;
        background-color: #ffffff;
        border: 1px solid #e2e2e2;
        border-radius: 2px;
        -webkit-box-shadow: 0px 3px 4px 0px rgba(64,112,203,0.06);
        box-shadow: 0px 3px 4px 0px rgba(64,112,203,0.06);
        color: #979ba5;
        font-size: 12px;
        .message-title {
            -webkit-box-flex: 0;
            -ms-flex: 0 0 48px;
            flex: 0 0 48px;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            color: #313238;
            font-size: 14px;
            padding: 0 20px;
            margin: 0;
            border-bottom: 1px solid #f0f1f5;
        }
        .message-list {
            -webkit-box-flex: 1;
            -ms-flex: 1;
            flex: 1;
            max-height: 450px;
            overflow: auto;
            margin: 0;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;
            -ms-flex-direction: column;
            flex-direction: column;
            padding: 0;
        }
        .message-list-item {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            width: 100%;
            padding: 0 20px;
            &:hover {
                cursor: pointer;
                background: #F0F1F5;
            }
            .item-message {
                padding: 13px 0;
                line-height: 16px;
                min-height: 42px;
                -webkit-box-flex: 1;
                -ms-flex: 1;
                flex: 1;
                -ms-flex-wrap: wrap;
                flex-wrap: wrap;
                color: #63656E;
            }
            .item-date {
                padding: 13px 0;
                margin-left: 16px;
                color: #979BA5;
            }
        }
        .message-footer {
            -webkit-box-flex: 0;
            -ms-flex: 0 0 42px;
            flex: 0 0 42px;
            border-top: 1px solid #f0f1f5;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
            color: #3a84ff;
        }
    }
    .monitor-navigation-nav {
        width: 150px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -ms-flex-direction: column;
        flex-direction: column;
        background: #FFFFFF;
        border: 1px solid #E2E2E2;
        -webkit-box-shadow: 0px 3px 4px 0px rgba(64,112,203,0.06);
        box-shadow: 0px 3px 4px 0px rgba(64,112,203,0.06);
        padding: 6px 0;
        margin: 0;
        color: #63656E;
        .nav-item {
            -webkit-box-flex: 0;
            -ms-flex: 0 0 32px;
            flex: 0 0 32px;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            padding: 0 16px;
            list-style: none;
            &:hover {
                color: #3A84FF;
                cursor: pointer;
                background-color: #F0F1F5;
            }
            .lang-icon {
                font-size: 20px;
                margin-right: 6px;
            }
        }
    }
    .monitor-navigation-admin {
        width: 170px #63656E;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -ms-flex-direction: column;
        flex-direction: column;
        background: #FFFFFF;
        border: 1px solid #E2E2E2;
        -webkit-box-shadow: 0px 3px 4px 0px rgba(64,112,203,0.06);
        box-shadow: 0px 3px 4px 0px rgba(64,112,203,0.06);
        padding: 6px 0;
        margin: 0;
        color: #63656E;
        .nav-item {
            -webkit-box-flex: 0;
            -ms-flex: 0 0 32px;
            flex: 0 0 32px;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            padding: 0 16px;
            list-style: none;
            &:hover {
                color: #3A84FF;
                cursor: pointer;
                background-color: #F0F1F5;
            }
            .lang-icon {
                font-size: 20px;
                margin-right: 6px;
            }
        }
    }
    .tippy-popper .tippy-tooltip.navigation-message-theme {
        padding: 0;
        border-radius: 0;
        -webkit-box-shadow: none;
        box-shadow: none;
    }
</style>
