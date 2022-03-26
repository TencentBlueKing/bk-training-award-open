<template>
    <div class="top-back" @click="handleBack">
        <img :src="robotImg" alt="返回按钮" class="top-robot" :draggable="false" /><span class="title">返回</span>
    </div>
</template>

<script>

    export default {
        name: 'top-back',
        data () {
            return {
                robotImg: require('@/images/robot.png'),
                count: 0
            }
        },
        methods: {
            handleBack () {
                return this.$router.go(-1)
            }
        }
    }
</script>

<style lang="postcss" scoped>
.top-back {
  display: inline-block;
  .top-robot {
    width: 6em;
    transform: rotateY(-180deg);
    user-select: none;

  }

  .title {
    font-weight: 700;
    font-size: 24px;
    text-align: center;
    cursor: pointer;
    color: #0E7AE2;
    user-select: none;

    &:hover {
    }
  }
}
</style>
