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
                :src="award['award_image']"
                fit="fill"
                :preview-src-list="[award['award_image']]"
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

<style lang="postcss" scoped>
  @import './index.css';
</style>
