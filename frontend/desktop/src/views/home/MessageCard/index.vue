<template>
    <div class="message-card">
        <div class="message-content">
            <div class="message-identical">
                <bk-badge :dot="true" :visible="!message['is_read']" theme="danger">
                    <span class="pl10 pr10" style="background-color: #0E7AE2;color: white;">
                        {{ message['group_name'] }}
                    </span>
                </bk-badge>
                <bk-link theme="primary" v-bk-copy="message['action_display_name_for_display']"> {{ message['action_display_name_for_display'] }}</bk-link>
            </div>
            <div class="message-panel" v-bk-overflow-tips>
                {{ message['message'] }}
            </div>
        </div>

        <div class="mt20 message-header">
            <bk-link theme="danger" @click="handleClickTopButton($event)"
                :underline="true"
                v-show="!message['is_read']"
            >
                标记已读
            </bk-link>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'message-card',
        props: {
            message: {
                type: Object,
                default: () => ({
                    create_time: '2021-03-02 hh:mm',
                    group_name: '小组名',
                    action_user: '3234853521Q',
                    action_display_name: '陈润',
                    message: '通过您的第一次申请'
                })
            }
        },
        data () {
            return {
                // TODO: add random color to diff the tag
                randomColor: [
                    ['#0E7AE2', '#FFFFFF'],
                    ['#A46244', '#FFFFFF'],
                    ['#4A4B9D', '#FFFFFF'],
                    ['#274A78', '#FFFFFF']
                ]
            }
        },
        created () {
        },
        methods: {
            handleClickTopButton () {
                this.$emit('tool-click')
            }
        }
    }
</script>

<style lang="postcss" scoped>
.message-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;

  padding: 5px;

  background: #FFFFFF;
  border: 1px solid #F5F7FA;
  box-sizing: content-box;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  .message-header {
    width: 100%;
    text-align: right;
    margin-bottom: 12px;
  }
  .message-panel {
    max-height: 80px;
    padding-top: 6px;
    text-indent: 12px;
    overflow-y:scroll;
    text-overflow: ellipsis;

  }
}
</style>
