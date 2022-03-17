<template>
    <div class="message-card">
        <div class="message-header">
            <span> 2021-03-11 08:00</span>
            <bk-link theme="danger" underline>标记已读</bk-link>
        </div>
        <div class="message-content">
            <bk-link theme="primary">3234853521Q（陈润）</bk-link>
            通过您的 微力海选一等奖 的申请
        </div>
    </div>
</template>

<script>
    export default {
        name: 'message-card',
        data () {
            return {}
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
