<template>
    <div class="header-nav"
        @click="$emit('click',$event)"
        v-bk-tooltips.light="$attrs['description']"
    >
        <div class="header-container">
            <div class="right-panel">
                <div class="title">
                    <slot></slot>
                </div>
            </div>
            <div class="left-panel">
                <bk-icon type="arrows-right-circle" class="go-icon" />
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'header-nav',
        props: {},
        data () {
            return {}
        }
    }
</script>

<style lang="postcss" scoped>
@import "@/css/animation/index.css";

$card-width:  330px;
$card-height: 137px;

.header-nav {
  width: 100%;
  min-width: calc($card-width - 60px);
  max-width: calc($card-width);

  height: $card-height;
  padding: 20px;
  background: linear-gradient(90deg, #ff512f, #dd2476);
  border-radius: 20px;
  position: relative;
  cursor: pointer;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);

  .header-container {
    display: flex;
    justify-content: center;
    color: white;
    height: 100%;
    .right-panel {
      width: 70%;
      height: inherit;
      display: flex;
      align-items: center;

      .title {
        font-style: normal;
        font-weight: 600;
        font-size: 25px;
        line-height: 41px;
      }
    }

    .go-icon {
      transition: all .3s;
    }

    &:hover .go-icon {
      transform: scale(3) translateX(2px);
    }

    .left-panel {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: calc($card-width - 25% - 70%);
      padding: 12px 0;

    }

  }
}
</style>
