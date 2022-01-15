<template>
    <div class="table-column-container"></div>
</template>
<script>
    export default {
        name: 'table-column',
        props: {
            label: {
                type: String,
                default: ''
            },
            prop: {
                type: String,
                default: ''
            }
        },
        mounted () {
        }
    }
</script>
<style>

</style>
