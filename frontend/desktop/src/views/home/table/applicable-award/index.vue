<template>
    <!--    可申请奖项表格-->
    <self-table :data="applicationableAwardList">
        <bk-table-column label="序列" width="60"></bk-table-column>
        <bk-table-column label="奖项名称"></bk-table-column>
        <bk-table-column label="所属小组"></bk-table-column>
        <bk-table-column label="截止申请时间"></bk-table-column>
        <bk-table-column label="操作">
            <template slot-scope="groups">
                <bk-button :text="true" @click="toApply(groups.row)">
                    立即申请
                </bk-button>
            </template>
        </bk-table-column>
    </self-table>
</template>

<script>
    import { DETAIL_ROUTE_PATH } from '@/constants'

    export default {
        name: 'applicable-award',
        data () {
            return {
                applicationableAwardRemoteList: []
            }
        },
        computed: {
            applicationableAwardList (self) {
                return self.applicationableAwardRemoteList
            }
        },
        methods: {
            toApply (group) {
                this.$router.push({
                    name: DETAIL_ROUTE_PATH,
                    query: {
                        type: 'apply'
                    }
                })
            }

        }
    }
</script>
