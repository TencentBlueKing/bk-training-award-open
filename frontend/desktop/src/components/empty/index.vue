<template>
    <bk-exception class="exception-wrap-item exception-part" type="empty" scene="part">
        <span v-if="!$slots['description']">暂无内容</span>
        <slot name="description"></slot>
    </bk-exception>
</template>
<script>
    export default {
        name: 'empty',
        data () {
            return {}
        }
    }

</script>
