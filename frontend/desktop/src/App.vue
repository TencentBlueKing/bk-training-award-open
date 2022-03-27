<template>
    <div class="monitor-navigation" :class="systemCls">
        <bk-navigation
            :header-title="nav.title"
            :side-title="nav.title"
            :default-open="true"
            :need-menu="false"
            :navigation-type="'top-bottom'"
            @toggle="handleToggle"
        >
            <template slot="header">

                <div class="monitor-navigation-header">
                    <ol class="header-nav">
                        <bk-breadcrumb>
                            <bk-breadcrumb-item style="color: white;">{{ $bus.headerName }}</bk-breadcrumb-item>
                        </bk-breadcrumb>
                    </ol>
                </div>
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
    import { setTitle } from '@/common/util'

    export default {
        name: 'monitor-navigation',
        components: {
            AppAuth: () => import('@/components/auth')
        },
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
                }
            }
        },
        computed: {
            ...mapGetters(['mainContentLoading', 'user'])
        },
        watch: {
            '$route.meta': {
                immediate: true,
                handler (newValue) {
                    setTitle(newValue.title)
                }
            }
        },
        created () {
            const platform = window.navigator.platform.toLowerCase()
            if (platform.indexOf('win') === 0) {
                this.systemCls = 'win'
            }

            this.$bus.$on('main-loading', (value) => {
                this.$store.commit('setMainContentLoading', value)
            })
        },
        methods: {
            handleToggle (v) {
                this.nav.toggle = v
            }
        }
    }
</script>

<style lang="postcss">
@import './css/reset.css';
@import './css/app.css';
@import "@/css/mixins/scroll.css";

* {

   &::-webkit-scrollbar {
        width: 4px;
    }
    &::-webkit-scrollbar-thumb {
        height: 5px;
        border-radius: 2px;
        background-color: #e6e9ea;
    }
}

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
  font-size: 14px;
  color: #737987;
  height: calc(100% - 84px);
  background: transparent;
  width: 100%;

  .main-content {
    height: calc(100%);
    width: 100%;
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

.w-80 {
  width: 80% !important;
}
</style>
