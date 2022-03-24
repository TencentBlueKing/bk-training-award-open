<template>
    <!--    <keep-alive>-->
    <router-view :key="$route.path"></router-view>
<!--    </keep-alive>-->
</template>

<script>
    export default {
        data () {
            return {
        
            }
        },
        watch: {
            '$route.name': {
                handler () {
                    // 此乃是解决  router.back 或者 go(-1)的解决方法
                    const pass = sessionStorage.getItem('is_pass')
                    if (!pass) {
                        sessionStorage.setItem('pass', 'true')
                    }
                }
            }
        },
        beforeDestroy () {
            sessionStorage.setItem('pass', '')
        }
    }

</script>
