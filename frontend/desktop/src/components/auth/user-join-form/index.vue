<template>
    <bk-form :label-width="90"
        :rules="rules"
        :model="form"
        ref="form"
    >
        <bk-form-item label="组织名"
            :required="true"
            ref="form"
        >
            <select-search placeholder="请选择需要加入的小组"
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
                    group_id: ''
                },
                rules: Object.freeze({
                    group_id: [
                        {
                            required: true,
                            message: '请选择需要加入的小组',
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

<style scoped>

</style>
