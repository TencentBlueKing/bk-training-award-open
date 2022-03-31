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

    export default {
        name: 'award-manager',
        components: {
            PendingStart: () => import('./table/pending-start'),
            IngAward: () => import('./table/ing-award'),
            IngReview: () => import('./table/ing-review'),
            EndedReview: () => import('./table/ended-review')
        },
        data () {
            return {
                // tab 当前表现对应 key 值
                workbench: 'pending-start',
                // tab 设置
                awardListTabItems: [
                    {
                        'tab-name': '待开始',
                        'tab-key': 'pending-start'
                    },
                    {
                        'tab-name': '开放中',
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
        methods: {
            handleInit () {
                this.$refs[this.workbench]?.handleInit?.()
            }
        }
    }

</script>
<style lang="postcss" scoped>
@import "./index.css";
</style>
