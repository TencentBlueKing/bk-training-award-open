<template>
    <bk-dialog v-model="visible"
        :header-position="'left'"
        :loading="loading"
        @confirm="confirm"
        @cancel="cancel"
        theme="primary"
        :mask-close="false"
        :z-index="10000"
    >

        <bk-link theme="primary">3234853521Q(陈润)邀请您加入小组：</bk-link>
        <h2 class="center-content mt20">
            <bk-link theme="danger">3234853521Q(陈润)</bk-link>
        </h2>
    </bk-dialog>
</template>
<script>

    export default {
        name: 'invite',
        components: {
        },
        data () {
            return {
                visible: true,
                loading: false
            }
        },
        created () {
          
        },
        methods: {
          
            confirm () {
                this.messageSuccess('已同意加入')
                window.location.href = 'home'
            },
            cancel () {
                window.location.href = 'home'
            }
        }

    }
</script>
