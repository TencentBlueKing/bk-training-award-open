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
    import {
        MYAPPLY_DRAFT_TAB_KEYNAME,
        MYAPPLY_ENDED_APPROVAL_TAB_KEYNAME,
        MYAPPLY_ING_APPROVAL_TAB_KEYNAME,
        MYAPPLY_ING_APPLY_TAB_KEYNAME,
        MYAPPLY_ROUTER_KEYNAME
    } from '@/constants'

    export default {
        components: {
            [MYAPPLY_DRAFT_TAB_KEYNAME]: () => import('@/views/myapply/table/draft'),
            [MYAPPLY_ING_APPLY_TAB_KEYNAME]: () => import('@/views/myapply/table/pending-approval'),
            [MYAPPLY_ENDED_APPROVAL_TAB_KEYNAME]: () => import('@/views/myapply/table/ended-approval')
        },
        data () {
            return {
                userInfo: null,
                data: [],
                remoteData: [],
                isLoading: false,
                // 当前选择的表格
                curSelectedTable: MYAPPLY_DRAFT_TAB_KEYNAME,
                myApplyTabItems: [
                    {
                        'tab-name': '草稿',
                        'tab-key': MYAPPLY_DRAFT_TAB_KEYNAME
                    }, {
                        'tab-name': '申请中',
                        'tab-key': MYAPPLY_ING_APPLY_TAB_KEYNAME
                    }, {
                        'tab-name': '已评审',
                        'tab-key': MYAPPLY_ENDED_APPROVAL_TAB_KEYNAME
                    }
                ]
            }
        },
        created () {
            const curType = this.$route.query[MYAPPLY_ROUTER_KEYNAME]
            if (curType && [
                MYAPPLY_DRAFT_TAB_KEYNAME,
                MYAPPLY_ING_APPLY_TAB_KEYNAME,
                MYAPPLY_ING_APPROVAL_TAB_KEYNAME,
                MYAPPLY_ENDED_APPROVAL_TAB_KEYNAME
            ].includes(curType)) {
                this.curSelectedTable = curType
            }
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
