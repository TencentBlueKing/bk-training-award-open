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
        :title="!$slots['title'] || $attrs['title']"
    >
        <slot name="title" slot="header"></slot>
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
                this.loading = true
                this.$emit('confirm', () => {
                    this.loading = false
                })
            },
            cancel () {

            }
        }
    }
</script>

<style scoped>
.dialog-title {
  position: relative;

}
</style>
