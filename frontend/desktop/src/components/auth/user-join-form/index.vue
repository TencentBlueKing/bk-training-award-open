<template>
    <bk-form :label-width="90">
        <bk-form-item label="组织名"
            :required="true"
        >
            <select-search placeholder="请输入需要加入的组织名"
                style="width: calc(2*118px + 8px)"
                type="group"
                :multiple="false"
                :id-key="'group_id'"
                :value.sync="form['group_id']"
            ></select-search>
        </bk-form-item>
    </bk-form>
</template>

<script>
    export default {
        name: 'user-join-form',
        data () {
            return {
                form: {
                    'group_id': ''
                }
            }
        },
        methods: {
            getFields () {
                return this.form
            }
        }
    }
</script>

<style scoped>

</style>
