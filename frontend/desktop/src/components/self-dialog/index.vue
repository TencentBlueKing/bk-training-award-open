<template>
    <bk-dialog v-model="visible"
        :header-position="'left'"
        :loading="loading"
        @confirm="confirm"
        @cancel="cancel"
        @value-change="$emit('change',$event)"
        :mask-close="false"
        :ok-text="$attrs['ok-text']"
        :cancel-text="$attrs['cancel-text']"
        :title="$attrs['title']"
    >
        <slot></slot>
    </bk-dialog>
</template>

<script>
    export default {
        name: 'index',
        model: {
            prop: 'visible',
            event: 'change'
        },
        props: {
            visible: {
                type: Boolean,
                default: () => false
            }
        },
        data () {
            return {
                loading: false
            }
        },
        methods: {
            confirm () {
                this.$emit('confirm')
            },
            cancel () {
            
            }
        }
    }
</script>

<style scoped>

</style>
