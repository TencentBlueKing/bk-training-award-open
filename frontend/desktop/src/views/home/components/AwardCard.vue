<template>
    <div class="award-card-container">
        <div class="header">
            <div class="title-badge">
                <span class="enterprise" :title="award['awardName'] ">
                    {{ award['award_level'] }}
                </span>
                <span class="award-name" :title="award['awardName'] ">
                    {{ award['award_name'] }}
                </span>
            </div>
            <span class="status apply" v-show="award['applyStatus']">{{ award['applyStatus'] }}</span>
        </div>
        <div class="content" :title="award['descriptionContent']">
            <bk-image
                class="description-image"
                :src="award['award_image']"
                fit="contain"
            ></bk-image>
            <div class="description-content">
                {{ award['award_description'] }}
            </div>
        </div>
        <div class="footer mt10 center-content ">
            <bk-button ext-cls="mr10 ml10 w-100"
                theme="primary"
                :outline="true"
                @click="handleToGetDetail(award)"
            > 查看详情
            </bk-button>
        </div>
    </div>

</template>

<script>
    import { APPROVAL_STATE } from '@/constants'
    export default {
        name: 'AwardCard',
        props: {
            award: {
                type: Object,
                default: () => ({
                    descriptionContent: '',
                    enterpriseName: '',
                    awardName: '',
                    applyStatus: APPROVAL_STATE['NOT_APPLY'],
                    descImage: ''
                })
            }
        },
        data () {
            return {}
        },
        methods: {
            handleToGetDetail (award) {
                this.$router.push({
                    name: 'detail',
                    params: {
                      ...award,
                      type: 'detail'
                    }
                })
            }
        }
    }
</script>

<style scoped>
@define-mixin overflow-tip $line:1 {
  display: -webkit-box;
  text-overflow: ellipsis;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: $line;
}

.award-card-container {
  display: inline-block;

  overflow: hidden;

  padding: 1em;

  width: 250px;
  min-width: 250px;

  background: #FFFFFF;
  box-shadow: 0 0 4px 2px rgba(25, 25, 41, 0.05);
  border-radius: 6px;

  .w-100 {
    width: 100%;
  }

  .description-image {
    width: 100%;
    height: 100px;
    user-select: none;
  }

  .description-content {
    @mixin overflow-tip 6;
    text-indent: 1em;
    min-height: 7em;
    width: 100%;
    padding: 2px;
    background: #F5F7FA;

    color: #000000;
  }

  .header {
    margin-bottom: 12px;
    position: relative;

    .title-badge {
      background: #FFFFFF;
      border-radius: 5px;
      color: #828282;
      display: flex;
      height: 2em;
      line-height: 2em;

      .enterprise {
        @mixin overflow-tip 1;

        min-width: 48px;
        text-align: center;
        background: #EAEBF0;
        border-radius: 5px 0 0 5px;
        color: #63656E;
        box-shadow: 0 0 2px 2px #eeeeee;
      }

      .award-name {
        @mixin overflow-tip 1;
        text-indent: .2em;
        padding: 0 2px;

      }

    }

    .status.level {
      @mixin overflow-tip 1;
      background: #3A84FF;
      box-shadow: 0 0 2px 2px #eeeeee;
      color: white;
      height: 2em;
      line-height: 2em;
      padding: 0 2px;
    }

    .status.apply {
      color: white;
      opacity: 80%;
      position: absolute;
      right: -20%;
      text-align: center;
      top: 0;
      transform: rotate(45deg);
      width: 50%;

      user-select: none;
      background: #00c873;

      &.ing {
        background: #00c873;
      }

      &.pending {
        background: #7B61FF;
      }
    }

  }
}

</style>
