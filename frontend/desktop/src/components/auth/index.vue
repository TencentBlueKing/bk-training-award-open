<template>
    <div class="bk-login-dialog" v-if="isShow">
        <div class="bk-login-wrapper">
            <div class="container">
                <p class="title">
                    {{ config[createType]['tips'] }}
                    <span v-bk-tooltips="config[createType]['question']"
                        v-if="config[createType]['question']"
                        style="color:dodgerblue;"
                        class="bottom-middle"
                    >
                        <i class="bk-icon icon-info-circle-shape"></i>
                    </span>
                </p>
                <div class="select-panel center-content">
                    <transition-group name="bk-move-in-right">
                        <div v-if="isShow && createType === 'create'" key="create">
                            <div class="dialog-content">
                                <create-group-form v-if="createType === 'create'" ref="create"></create-group-form>
                            </div>
                            <div class="tips-panel center-content mb20">
                                <bk-link theme="primary" @click=" handleTriggerType('join','加入小组')"> 加入小组？</bk-link>
                                <bk-link theme="primary" @click=" handleTriggerType('from-bk','从蓝鲸系统迁移')" underline> 从蓝鲸系统迁移？</bk-link>
                            </div>
                        </div>
                        <div v-if="isShow && createType === 'join'" key="join">
                            <div class="dialog-content">
                                <user-join-form v-if="isShow && createType === 'join'" ref="join"></user-join-form>
                            </div>
                            <div class="tips-panel center-content mb15">
                                <bk-link theme="primary" @click="handleTriggerType('create','创建小组')"> 创建小组？</bk-link>
                                <bk-link theme="primary" @click="handleTriggerType('from-bk','从蓝鲸系统迁移')" underline> 从蓝鲸系统迁移？</bk-link>
                            </div>
                        </div>
                        <div v-if="isShow && createType === 'from-bk'" key="from-bk">
                            <div class="dialog-content">
                                <bk-group-form v-if="isShow && createType === 'from-bk'" ref="from-bk"></bk-group-form>
                            </div>

                            <div class="tips-panel center-content mb20">
                                <bk-link theme="primary" @click=" handleTriggerType('join','加入小组')" underline> 加入小组？</bk-link>
                                <bk-link theme="primary" @click="handleTriggerType('create','创建小组')"> 创建小组？</bk-link>
                            </div>
                        </div>
                    </transition-group>
                </div>
                <div class="button-panel left-content">
                    <bk-button theme="danger"
                        class="mr10"
                        v-if="!isNewer"
                        @click="isShow = false"
                    >
                        取消
                    </bk-button>
                    <bk-button theme="primary" class="ml10" @click="handleToBeOlder(createType,$refs[createType])">
                        确认
                    </bk-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { APP_AUTH_NEWER, APP_GROUP_DIALOG } from '@/constants'
    import { bus } from '@/store/bus'
    import { postGroup, postGroupUser } from '@/api/service/group-service'

    export default {
        name: 'app-auth',
        components: {
            CreateGroupForm: () => import('@/components/auth/create-group-form'),
            UserJoinForm: () => import('@/components/auth/user-join-form'),
            BkGroupForm: () => import('@/components/auth/bk-group-form')
        },
        data () {
            return {
                config: {
                    'join': {
                        tips: '加入小组'
                    },
                    'create': {
                        tips: '创建小组'
                    },
                    'from-bk': {
                        tips: '从蓝鲸系统迁移',
                        question: '从蓝鲸用户管理系统中选取组织'
                    }
                },
                isShow: false,
                createType: 'join',
                isNewer: false,
                groupForm: {
                    group_name: ''
                }

            }
        },
        computed: {},
        mounted () {
            bus.$on(APP_AUTH_NEWER, (isNewer) => {
                this.isShow = isNewer
                this.isNewer = isNewer
            })
            bus.$on(APP_GROUP_DIALOG, ([isShow, canCancel, type = 'join']) => {
                this.isShow = isShow
                this.isNewer = !canCancel
                this.createType = type
            })
        },
        methods: {
            handleTriggerType (type) {
                this.createType = type
            },
            handleToBeOlder (createType, formInstance) {
                const params = formInstance.getFields()
                switch (createType) {
                    case 'join':
                        this.joinGroup(params)
                        break
                    case 'create':
                        this.createGroup(params)
                        break
                    case 'from-bk':
                        this.fromBkGroup(params)
                        break
                }
            },
            joinGroup (params) {
                return postGroupUser(params).then(res => {
                    console.log(res)
                })
            },
            createGroup (params) {
                return postGroup(params).then(res => {
                    this.messageSuccess('创建成功,请尽情使用本系统')
                    this.isShow = false
                })
            },
            fromBkGroup (params) {

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
