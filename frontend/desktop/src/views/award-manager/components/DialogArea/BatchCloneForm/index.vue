<template>
    <div class="batch-clone-form-container">
        <bk-dialog v-model="visible"
            theme="primary"
            :mask-close="false"
            title="批量克隆">
            <bk-form>
                <!-- 已选择 -->
                <bk-form-item></bk-form-item>
                <!-- /已选择 -->
                
                <!-- 奖项重命名 -->
                <bk-form-item></bk-form-item>
                <!-- /奖项重命名 -->

                <!-- 配置时间信息 -->
                <bk-form-item></bk-form-item>
                <!-- /配置时间信息 -->
            </bk-form>
        </bk-dialog>
    </div>
</template>
<script>
    import { dialogMixins } from '../mixins'

    export default {
        name: 'batch-clone-form-container',
        mixins: [dialogMixins],
        data () {}
    }
</script>
<style>
    @import "./index.css";
</style>
