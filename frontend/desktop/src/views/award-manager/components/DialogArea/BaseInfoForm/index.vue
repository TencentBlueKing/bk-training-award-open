<template>
    <div class="end-award-container">
        <bk-dialog v-model="visible"
            theme="primary"
            :mask-close="false"
            title="基本信息"
        >
        </bk-dialog>
    </div>
    
</template>
<script>
    import { dialogMixins } from '../mixins'

    export default {
        name: 'end-award-form',
        mixins: [dialogMixins],
        data () {
            return {

            }
        }
    }
</script>
