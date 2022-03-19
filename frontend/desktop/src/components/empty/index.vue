<template>
    <bk-exception class="exception-wrap-item exception-part" type="empty" scene="part">
        <span v-if="!$slots['description']">正如您所见,这里空空如也~</span>
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
