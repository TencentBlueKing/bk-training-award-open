<template>
    <div class="status-button-container">
        <bk-button class="mr10"
            v-if="approvalState[$attrs['status']]"
            @click="$emit('click')"
            theme="primary"
            text
        >
            {{ approvalState[$attrs['status']]}}
        </bk-button>
    </div>
</template>
<script>
    export default {
        name: 'status-button',
        data () {
            return {
                approvalState: {
                    0: '撤回申请',
                    1: '--',
                    2: '重新申请',
                    3: '编辑申请'
                }
            }
        }
    }
</script>
<style scoped>

</style>
