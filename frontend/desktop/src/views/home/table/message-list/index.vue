<template>
    <div>
        <message-card v-for="item in $attrs['data']" :key="item['id']" :message="item"></message-card>
        <empty v-if="!$attrs['data'].length"></empty>
    </div>
</template>

<script>
    export default {
        name: 'message-list',
        components: {
            MessageCard: () => import('@/views/home/MessageCard')
        },
        data () {
            return {}
        }
    }
</script>

<style scoped>

</style>
