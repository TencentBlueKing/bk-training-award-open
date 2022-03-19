<template>
    <div class="tab-container">
        <div class="tab-header">
            <div v-for="item in tabItems || []"
                :key="item['tab-name']"
                :class="[
                    'tab-item',
                    {
                        'active': item['tab-key'] === curTab
                    }]" @click="tabClick(item)">
                <p v-waves>
                    {{ item['tab-name'] }}
                </p>
            </div>
            <div class="controller">
                <slot name="right-controller"></slot>
            </div>
        </div>
        <div class="tab-content">
            <!--            <transition name="bk-move-in-left">-->
            <slot></slot>
            <!--            </transition>-->
        </div>
        <div class="tab-footer">
            <slot name="tab-footer"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Tabs',
        model: {
            prop: 'curTab',
            event: 'tab-click'
        },
        props: {
            tabItems: {
                type: Array,
                default: () => []
            },
            defaultKey: {
                type: String,
                default: () => null
            },
            curTab: {
                type: String,
                default () {
                    return this.defaultKey || this.tabItems?.[0]?.['tab-key']
                }
            }

        },
        data (self) {
            return {}
        },
        methods: {
            tabClick (tabItem) {
                if (this.curTab === tabItem['tab-key']) return
                this.curTab = tabItem['tab-key']
                this.$emit('tab-click', tabItem['tab-key'])
            }
        }
    }
</script>

<style lang="postcss" scoped>
.tab-container {
  background-color: #FFFFFF;
  border-radius: 20px;
  box-shadow: 0 4px 90px rgba(163, 171, 185, 0.24);
  padding-bottom: 2em;
  position: relative;

  display: flex;
  flex-direction: column;

  .tab-header {
    display: flex;
    padding: 20px 12px 8px;
    position: relative;

    .tab-item {
      font-weight: 700;
      font-size: 16px;
      /* identical to box height */

      /* Primary */
      color: #1F4173;
      position: relative;
      margin: 0 12px;
      cursor: pointer;
      user-select: none;

      &:hover {
        transition: width 1s;
        color: #0E7AE2;
      }

      &.active::after {
        content: '';
        position: absolute;
        height: 7px;
        width: 82.7%;
        left: 50%;
        transform: translate(-50%);
        bottom: -12px;
        background: #0A11C5;
        border-radius: 12px;
        animation: scale-x .2s linear;
      }
    }

    .controller {
      position: absolute;
      right: 2em;
    }
  }

  .tab-content {
    width: 98%;
    margin: 12px auto;
    padding: 0 12px;
    height: calc(100% - 40px - 60px);
    overflow-y: scroll;
  }

  .tab-footer {
    width: 98%;
    margin: 0 auto;
    align-self: flex-end;
    display: flex;
    justify-content: flex-end;
  }
}

@keyframes scale-x {
  from {
    width: 0;
  }
  to {
    width: 82.7%;
  }
}
</style>
