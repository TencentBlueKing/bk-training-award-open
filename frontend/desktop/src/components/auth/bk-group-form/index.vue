<template>
    <bk-form :label-width="80">
        <bk-form-item label="组织名"
            :required="true"
        >
            <select-search placeholder="请选择要迁移的小组"
                style="width: calc(2*118px + 8px)"
                type="bk-group"
                :multiple="false"
                :value.sync="form['group_name']"
            ></select-search>
        </bk-form-item>
    </bk-form>
</template>
<script>
    export default {
        name: 'bk-group-form',
        data () {
            return {
                form: {
                    group_name: ''
                }
            }
        }
    }
</script>
