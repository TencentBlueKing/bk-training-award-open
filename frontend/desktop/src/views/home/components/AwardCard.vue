<template>
    <div class="award-card-container">
        <div class="header">
            <div class="title-badge">
                <div class="info-box">
                    <span :class="['status','apply',award['approval_state_en']]">{{ award['approval_state'] }}</span>
                    <span class="enterprise" :title="award['award_level'] ">
                        {{ award['award_level'] }}
                    </span>
                </div>
                <span class="award-name" :title="award['award_name'] ">
                    {{ award['award_name'] }}
                </span>
            </div>
        </div>
        <div class="content" :title="award['award_description']">
            <bk-image
                class="description-image"
                :src="'https://n.sinaimg.cn/sinakd20220205ac/160/w1280h1280/20220205/0bca-08aa5c76de127d2eebb244de160098df.jpg'"
                fit="fill"
                :preview-src-list="['https://n.sinaimg.cn/sinakd20220205ac/160/w1280h1280/20220205/0bca-08aa5c76de127d2eebb244de160098df.jpg']"
            ></bk-image>
            <div class="description-content">
                {{ award['award_description'] }}
            </div>
        </div>
        <div class="footer mt10 center-content ">
            <bk-button ext-cls="w-100"
                theme="primary"
                @click="handleToGetDetail(award)"
            > 查看详情
            </bk-button>
        </div>
    </div>

</template>

<script>
    export default {
        name: 'AwardCard',
        props: {
            award: {
                type: Object,
                default: () => ({
                    award_level: '',
                    award_name: '',
                    approval_state_en: '',
                    approval_state: '',
                    award_description: '',
                    award_image: ''
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

  width: 300px;
  min-width: 300px;

  background: #FFFFFF;
  box-shadow: 0 0 4px 2px rgba(25, 25, 41, 0.05);
  border-radius: 6px;

  .w-100 {
    width: 100%;
  }

  .content {
    display: flex;
    gap: 12px;
    background: rgba(64, 112, 203, 0.06);
    padding: 4px;
    border-radius: 4px;
    gap: 12px;
    box-shadow: 0 0 2px 2px rgba(64, 112, 203, 0.06);
    flex-direction: column;
    .description-image {
      width: 100%;
      user-select: none;
      aspect-ratio: 4 /  3;
    }

    .description-content {
      @mixin overflow-tip 6;
      text-indent: 1em;
      min-height: 7em;
      width: 100%;
      padding: 2px;
      color: #000000;
    }

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

      .info-box {
        display: flex;
        white-space: nowrap;
        align-items: center;

      }

      .enterprise {
        display: inline-block;
        text-align: center;
        background: #EAEBF0;
        border-radius: 0 5px 5px 0;
        color: #63656E;
        box-shadow: 0 0 2px 2px #eeeeee;
        padding: 0 6px;
      }

      .award-name {
        @mixin overflow-tip 1;
        text-indent: 1em;
      }

    }

    .status.level {
      @mixin overflow-tip 1;
      background: #3A84FF;
      box-shadow: 0 0 2px 2px #eeeeee;
      color: white;
      height: 2em;
      line-height: 2em;
    }

    .status.apply {
      display: inline-block;
      min-width: 48px;
      text-align: center;
      border-radius: 5px 0 0 5px;
      box-shadow: 0 0 2px 2px #eeeeee;
      color: white;
      padding: 0 6px;

      &.applied {
        background: #7B61FF;
      }

      &.not_apply {
        background: #00c873;
      }
    }

  }
}

</style>
