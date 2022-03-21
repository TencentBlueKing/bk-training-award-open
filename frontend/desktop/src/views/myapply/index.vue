<template>
    <div class="my-apply-container">
        <top-back></top-back>
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
            :tab-items="myApplyTabItems"
            v-model="curSelectedTable"
        >
            <template>
                <component :is="curSelectedTable" :ref="curSelectedTable"></component>
            </template>
        </tabs>
    </div>
</template>

<script>
    export default {
        components: {
            PendingApproval: () => import('@/views/myapply/table/pending-approval'),
            IngApproval: () => import('@/views/myapply/table/ing-approval'),
            EndedApproval: () => import('@/views/myapply/table/ended-approval')
        },
        data () {
            return {
                userInfo: null,
                data: [],
                remoteData: [],
                isLoading: false,

                // 当前选择的表格
                curSelectedTable: 'pending-approval',
                myApplyTabItems: [
                    {
                        'tab-name': '待审批',
                        'tab-key': 'pending-approval'
                    }, {
                        'tab-name': '审批中',
                        'tab-key': 'ing-approval'
                    }, {
                        'tab-name': '已审批',
                        'tab-key': 'ended-approval'
                    }
                ]
            }
        },
        computed: {
        },
        methods: {
            handleInit (curSelectedTable = this.curSelectedTable) {
                this.$refs[curSelectedTable]?.handleInit?.()
            }
        }
    }
</script>

<style lang="postcss" scoped>
@import './index.css';

.my-apply-container {
$size: 2;
  --xs: calc($size * 118px + ($size - 1) * 8px);
}
</style>
