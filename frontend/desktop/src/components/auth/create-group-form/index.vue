<template>
    <bk-form :label-width="100">
        <bk-form-item label="新的小组" :required="true"
        >
            <bk-input placeholder="请输入小组名" style="width: calc(2*118px + 8px)" v-model="form['group_name']"></bk-input>
        </bk-form-item>
    </bk-form>
</template>

<script>
    export default {
        name: 'create-group-form',
        data () {
            return {
                form: {
                    'group_name': ''
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
