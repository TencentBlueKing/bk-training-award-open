<template>
    <div class="container">
        <div class="validAward">
            <header class="award-header">
                <span>可申请奖项</span>
                <bk-button text icon-right="angle-double-right" @click="toValidAwards">
                    更多
                </bk-button>
            </header>
            <div class="loading" v-bkloading="{ isLoading: !validData.length, title: '数据加载中', zIndex: 10 }"></div>
            <div class="cards">
                <template v-for="award in validData">
                    <bk-card
                        title="卡片标题"
                        :show-head="true"
                        :key="award.id"
                        class="card"
                    >
                        <div slot="header" class="header-main">
                            <span style="font-weight: bold">{{award.award_name}}</span>
                            <span>
                                <span><bk-tag :theme="themeMap[award.award_level]" radius="10px">{{levelMap[award.award_level]}}</bk-tag></span>
                                <span><bk-tag :theme="stateThemeMap[award.approval_state]" radius="10px">{{stateMap[award.approval_state]}}</bk-tag></span>
                            </span>
                        </div>
                        <p>{{award.award_description}}</p>
                        <bk-image :src="img" fit="cover" @click="toDetail(award.id)"></bk-image>
                    </bk-card>
                </template>
            </div>
        </div>
        <div class="invalidAward">
            <header class="award-header">
                <span>历史奖项</span>
                <bk-button text icon-right="angle-double-right">
                    更多
                </bk-button>
            </header>
            <div class="loading" v-bkloading="{ isLoading: !historyData.length, title: '数据加载中', zIndex: 10 }"></div>
            <div class="cards">
                <template v-for="award in historyData">
                    <bk-card
                        title="卡片标题"
                        :show-head="true"
                        :key="award.id"
                        class="card"
                    >
                        <div slot="header" class="header-main">
                            <span style="font-weight: bold">{{award.award_name}}</span>
                            <span><bk-tag :theme="themeMap[award.award_level]" radius="10px">{{levelMap[award.award_level]}}</bk-tag></span>
                        </div>
                        <p>{{award.award_description}}</p>
                        <bk-image :src="award.award_image" fit="cover"></bk-image>
                    </bk-card>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'index',
        data () {
            return {
                validData: [],
                historyData: [],
                levelMap: {
                    0: '总公司级',
                    1: '部门级',
                    2: '小组级'
                },
                stateMap: {
                    0: '未开始',
                    1: '已开始',
                    2: '已结束'
                },
                themeMap: {
                    0: 'danger',
                    1: 'warning',
                    2: 'info',
                    3: 'success'
                },
                stateThemeMap: {
                    0: 'info',
                    1: 'success',
                    2: ''
                }
            }
        },
        created () {
            this.$http.get(
                'get_available_awards?page=1&size=3'
            ).then(res => {
                if (res.result) {
                    this.validData = res.data.data
                } else {
                    this.$bkMessage({
                        message: res.message,
                        theme: 'error'
                    })
                }
            })
            this.$http.get(
                'get_applyed_awards?page=1&size=3'
            ).then(res => {
                if (res.result) {
                    this.historyData = res.data.data
                } else {
                    this.$bkMessage({
                        message: res.message,
                        theme: 'error'
                    })
                }
            })
        },
        methods: {
            toValidAwards () {
                this.$router.push({
                    name: 'canawards'
                })
            },
            toDetail (id) {
                console.log(id)
                this.$router.push({
                    name: 'detail'
                })
            }
        }
    }
</script>

<style scoped>
.container{
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}
.loading{
    height: 300px;
    line-height: 300px;
    border: 1px solid #eee;
    text-align: center;
}
.award-header{
    display: flex;
    justify-content: space-between;
    padding: 15px;
    font-weight: bold;
    font-size: 20px;
}
.cards{
    display: flex;
    justify-content: space-between;
}
.card {
    width: 32%;
}
.card p{
    height: 56px;
    overflow: hidden;
    word-break: break-all;
}
.header-main{
    overflow: hidden;
    white-space: nowrap;
    display: flex;
    justify-content: space-between;
}

</style>
