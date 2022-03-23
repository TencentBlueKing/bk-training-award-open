<template>
    <div class="award-container">
        <top-back></top-back>
        <!-- 表格按钮区域 -->
        <div class="header-controller-panel mt15 mb20">
            <select-search
                style="width: calc(2*118px + 1*8px);font-size: 15px;"
                behavior="simplicity"
                placeholder="请选择小组"
                :value.sync="$bus.curGlobalGroupId"
                type="group"
                :id-key="'group_id'"
                :multiple="false"
                @change="handleInit()"
            ></select-search>
        </div>
        <tabs class="mt15"
            :tab-items="awardListTabItems"
            v-model="workbench"
            v-if="$bus.isCurGroupAdmin"
        >
            <template>
                <component :is="workbench" :ref="workbench"></component>
            </template>
        </tabs>
        <empty v-else>
            <div slot="description">
                <p class="mb20">不好意思，您不是该组管理员~</p>
                请联系本组（{{ $bus.curGlobalSelectedGroup['full_name'] }}）管理员: <span
                    style="color: #cc1111"
                >
                    {{ $bus.curGlobalSelectedGroup['secretary_display_name_for_dispaly'] }}
                </span>
            </div>
        </empty>
        <!-- /表格按钮区域 -->

        <!-- 弹出区域 -->
        <!-- /弹出区域 -->
    </div>
</template>
<script>
    import { tableMixins } from '@/common/mixins'

    export default {
        name: 'award-manager',
        components: {
            PendingStart: () => import('./table/pending-start'),
            IngAward: () => import('./table/ing-award'),
            IngReview: () => import('./table/ing-review'),
            EndedReview: () => import('./table/ended-review')
            // FilterSvg: () => import('./components/Svg/FilterSvg')
        },
        mixins: [
            /**
             * 分页器的混入
             * */
            tableMixins
        ],
        data () {
            return {
                // S 控制信息区
                // loading 状态
                workbench: 'pending-start',
                awardListTabItems: [
                    {
                        'tab-name': '待开始',
                        'tab-key': 'pending-start'
                    },
                    {
                        'tab-name': '已开始',
                        'tab-key': 'ing-award'
                    },
                    {
                        'tab-name': '评审中',
                        'tab-key': 'ing-review'
                    },
                    {
                        'tab-name': '已结束',
                        'tab-key': 'ended-review'
                    }
                ]

            }
        },
        created () {
            this.handleInit()
        },
        methods: {
            handleInit () {
                const workbench = this.workbench
                this.$refs[workbench]?.handleInit()
                // 添加监听事件
            }
        }
    }

</script>
<style lang="postcss" scoped>
  @import "./index.css";
</style>
