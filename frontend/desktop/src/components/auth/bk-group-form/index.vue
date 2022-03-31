<template>
    <bk-form :label-width="80"
        :rules="rules"
        :model="form"
        ref="form"
    >
        <bk-form-item label="组织名"
            :required="true"
            :property="'group_name'"
        >
            <select-search placeholder="请选择要迁移的小组"
                style="width: calc(2*118px + 8px)"
                type="bk-group"
                :id-key="'full_name'"
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
                },
                rules: Object.freeze({
                    group_name: [
                        {
                            required: true,
                            message: '请输入小组名',
                            trigger: 'blur'
                        }
                    ]
                })
              
            }
        },
        methods: {
            async getFields () {
                await this.$refs['form'].validate()
                return this.form
            }
        }
    }
</script>
