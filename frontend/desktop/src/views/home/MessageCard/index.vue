<template>
    <div class="message-card">
        <div class="message-header">
            <span> 2021-03-11 08:00</span>
            <bk-link theme="danger" @click="handleClickTopButton($event)" underline>标记已读</bk-link>
        </div>
        <div class="message-content">
            <bk-tag effect="filled"
                style="background-color: #0E7AE2;color: white"
            >
                {{ message['group_name'] || 'undefined'}}
            </bk-tag>
            <bk-link theme="primary"> {{ message['action_user'] || 'undefined' }}( {{ message['action_display_name'] || 'undefined' }})</bk-link>
            {{ message['message'] }}
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
        methods: {
            handleClickTopButton () {}
        }
    }
</script>

<style lang="postcss" scoped>
.message-card {
  display: flex;
  flex-direction: column;
  padding: 10px;

  .message-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  background: #FFFFFF;
  border: 1px solid #F5F7FA;
  box-sizing: border-box;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
}
</style>
