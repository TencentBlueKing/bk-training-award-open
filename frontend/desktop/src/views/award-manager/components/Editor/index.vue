<template>
    <VueEditor v-model="content"
        style="width: 80%"
    ></VueEditor>
</template>

<script>
    import { VueEditor } from 'vue2-editor'
    export default {
        name: 'markdown-it',
        components: {
            VueEditor
        },
        props: {
            content: {
                type: String
            }
        },
        data () {
            return { }
        }
    }
</script>

<style>
    
</style>
