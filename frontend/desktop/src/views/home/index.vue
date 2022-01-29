<template>
    <div class="container">
        <div class="validAward">
            <header class="award-header">
                <span>可申请奖项</span>
                <bk-button text icon-right="angle-double-right" @click="toValidAwards">
                    更多
                </bk-button>
            </header>
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
                            <span><bk-tag :theme="themeMap[award.award_level]" radius="10px">{{levelMap[award.award_level]}}</bk-tag></span>
                        </div>
                        <p>{{award.award_description}}</p>
                        <bk-image :src="img" fit="cover"></bk-image>
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
                validData: [
                    {
                        id: 1,
                        award_name: 'test1',
                        award_level: 1,
                        award_description: 'this is a long sdaghbfbafbaergajhytLmdkhnjg;oivuhfkl;vkl;vmjckbnvzmkmdjaovhdLM<nvkahvdhncm bzbvhahjNM<N,mn djLKnkdnKHuidha description.this is a long asfaffffffffffffffffffffffffffffffffffffffffffffffffff description.this is a long mndfgxxvbtfaegbcfx description.',
                        award_department_fullname: '总公司/高校联合开发组',
                        award_reviewers: [['cyb']],
                        award_consultant: 'cyb',
                        award_image: 'img/BlueK.jpg',
                        start_time: '2022-01-24',
                        end_time: '2022-02-20',
                        approval_state: 0
                    },
                    {
                        id: 2,
                        award_name: 'test2',
                        award_level: 2,
                        award_description: 'this is a long ........................ description',
                        award_department_fullname: '总公司/高校联合开发组',
                        award_reviewers: [['cyb']],
                        award_consultant: 'cyb',
                        award_image: 'img/BlueK.jpg',
                        start_time: '2022-01-24',
                        end_time: '2022-02-20',
                        approval_state: 1
                    },
                    {
                        id: 3,
                        award_name: 'test3',
                        award_level: 0,
                        award_description: 'this is a long ........................ description',
                        award_department_fullname: '总公司/高校联合开发组',
                        award_reviewers: [['cyb']],
                        award_consultant: 'cyb',
                        award_image: 'img/BlueK.jpg',
                        start_time: '2022-01-24',
                        end_time: '2022-02-20',
                        approval_state: 2
                    }
                ],
                img: 'http://dev.paas-edu.bktencent.com:8000/media/img/1348720859594.jpg',
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
