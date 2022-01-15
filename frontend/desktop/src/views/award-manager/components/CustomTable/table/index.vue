<template>
    <!-- TODO 暂时不好用 -->
    <table class="table" v-show="false">
        <thead>
            <tr>
                <th v-for="theadSetting in theadList" :key="theadSetting.prop">
                    {{theadSetting.label}}
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="tBodyData in data" :key="tBodyData">
                <td v-for="theadSetting in theadList" :key="theadSetting.prop">
                    {{ tBodyData[theadSetting.prop] }}
                </td>
            </tr>
        </tbody>
    </table>
</template>
<script>
    export default {
        name: 'table',
        props: {
            data: {
                type: Array,
                default: [
                    {
                        prizewinner: 'hello'
                    }
                ]
            }
        },
        data () {
            return {
                theadList: []
            }
        },
        mounted () {
            this.handleInit()
        },
        methods: {
            handleInit () {
                this.handleMapGetHeader(this.$slots.default)
            },
            handleMapGetHeader (traget) {
                this.theadList = traget.map((item) => {
                    return item.componentOptions && {
                        ...item.componentOptions.propsData
                    }
                }).filter(item => item)
            }
        }
    }
</script>
<style>

</style>
