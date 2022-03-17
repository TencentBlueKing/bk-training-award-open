<template>
    <div class="bk-login-dialog" v-if="isShow">
        <div class="bk-login-wrapper">
            <div class="container">
                <p class="title">
                    {{ config[creatType]['tips'] }}
                    <span v-bk-tooltips="config[creatType]['question']"
                        v-if="config[creatType]['question']"
                        style="color:dodgerblue;"
                        class="bottom-middle"
                    >
                        <i class="bk-icon icon-info-circle-shape"></i>
                    </span>
                </p>
                <div class="select-panel center-content">
                    <transition-group name="bk-move-in-right">
                        <div v-show="creatType === 'create'" key="create">
                            <div class="dialog-content">
                                <bk-form :label-width="100">
                                    <bk-form-item label="新的小组"
                                        required
                                    >
                                        <bk-input placeholder="请输入小组名" style="width: calc(2*118px + 8px)"></bk-input>
                                    </bk-form-item>
                                </bk-form>
                            </div>
                            <div class="tips-panel center-content mb20">
                                <bk-link theme="primary" @click=" handleTriggerType('join','加入小组')">  加入小组？ </bk-link>
                                <bk-link theme="primary" @click=" handleTriggerType('from-bk','加入小组')" underline>  从蓝鲸系统迁移？ </bk-link>
                            </div>
                        </div>
                        <div v-show="creatType === 'join'" key="join">
                            <div class="dialog-content">
                                <bk-form :label-width="90">
                                    <bk-form-item label="组织名"
                                        required
                                    >
                                        <select-search placeholder="请输入需要加入的组织名"
                                            style="width: calc(2*118px + 8px)"
                                            type="group"
                                            :multiple="false"
                                        ></select-search>
                                    </bk-form-item>
                                </bk-form>
                            </div>
                            <div class="tips-panel center-content mb15">
                                <bk-link theme="primary" @click="handleTriggerType('create','创建小组')">  创建小组？ </bk-link>
                                <bk-link theme="primary" @click="handleTriggerType('from-bk','创建小组')" underline>  从蓝鲸系统迁移？</bk-link>
                            </div>
                        </div>
                        <div v-show="creatType === 'from-bk'" key="from-bk">
                            <div class="dialog-content">
                                <bk-form :label-width="80">
                                    <bk-form-item label="组织名"
                                        required
                                    >
                                        <select-search placeholder="请选择要迁移的小组"
                                            style="width: calc(2*118px + 8px)"
                                            type="group"
                                        ></select-search>
                                    </bk-form-item>
                                </bk-form>
                            </div>

                            <div class="tips-panel center-content mb20">
                                <bk-link theme="primary" @click=" handleTriggerType('join','加入小组')" underline>  加入小组？</bk-link>
                                <bk-link theme="primary" @click="handleTriggerType('create','创建小组')">  创建小组？</bk-link>
                            </div>
                        </div>
                    </transition-group>

                </div>
                <div class="button-panel left-content">
                    <bk-button theme="primary">
                        确认
                    </bk-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import SelectSearch from '@/components/select-search'

    export default {
        name: 'app-auth',
        components: { SelectSearch },
        data () {
            return {
                config: {
                    'join': {
                        'tips': '加入小组'
                    },
                    'create': {
                        'tips': '创建小组'
                    },
                    'from-bk': {
                        'tips': '从蓝鲸系统迁移',
                        'question': '将蓝鲸用户管理中的组织同步到本系统中'
                    }
                },
                isShow: false,
                creatType: 'join'
            }
        },
        methods: {
            handleTriggerType (type) {
                this.creatType = type
            }
        }
    }
</script>

<style scoped>
@import './index.css';

.title {
  &::before {
    content: "";
    display: inline-block;
    width: 6px;
    height: 1em;
    vertical-align: middle;
    background-color: #0E7AE2;
    border-radius: 12px;
    transform: translateX(-6px);
  }
}

.select-panel span {
  overflow: hidden;
  display: flex;
  width: calc(3 * 118px + 2 * 8px);
  margin: 12px 0;

  .dialog-content {

    min-height: 118px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .tips-panel {
    display: flex;
    justify-content: space-around;
  }
}

.button-panel {
  display: flex;
  justify-content: flex-end;
}
</style>
