<template>
    <div class="cartoon-robot">
        <div :class="['message-cloud',$attrs['cloud-class']]" :style="$attrs['message-style']">
            <div class="message">
                <slot> </slot>
            </div>
            <img :src="cloudImg" alt="消息云" class="cloud" :draggable="false">
        </div>
        <img :src="robotImg" alt="机器人" class="robot" :draggable="false">
    </div>
</template>

<script>
    export default {
        name: 'cartoon-robot',
        data () {
            return {
                cloudImg: require('@/images/message-cloud.png'),
                robotImg: require('@/images/robot.png')
            }
        }
    }
</script>

<style lang="postcss" scoped>
.cartoon-robot {
  display: flex;
  flex-direction: column;
  flex: 1;

  max-width: 298px;

  position: absolute;
  user-select: none;
  .message-cloud {
    display: inline-block;
    position: relative;
    width: 298px;
    height: 110px;
    .message {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%);
      width: 90%;
      text-align: center;
    }
  }
  .robot {

  }
}
</style>
