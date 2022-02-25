<template>
    <div class="divider">
        <bk-divider align="left">
            <slot></slot>
        </bk-divider>
        <bk-button theme="primary"
            icon-right="eye"
            @click="$emit('click')"
            outline>
            更多
        </bk-button>
    </div>
</template>

<script>
    export default {
        name: 'Divider',
        data () {
            return {}
        }
    }
</script>

<style lang="postcss" scoped>

.divider {
  display: flex;
}
</style>
