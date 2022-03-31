<template>
    <bk-form :label-width="100"
        :rules="rules"
        :model="form"
        ref="form"
    >
        <bk-form-item label="新的小组"
            :required="true"
            :property="'group_name'"
        >
            <bk-input placeholder="为您的小组取个名" style="width: calc(2*118px + 8px)" v-model="form['group_name']"></bk-input>
        </bk-form-item>
    </bk-form>
</template>

<script>
    export default {
        name: 'create-group-form',
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

<style scoped>

</style>
