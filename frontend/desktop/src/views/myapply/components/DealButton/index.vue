<template>

    <bk-button v-if="type === 'deal-button'"
        @click="$emit('clcik')"
    >
        <slot></slot>
    </bk-button>

    <bk-tag v-if="type === 'status-button'"
        :ext-cls="[]"
    >
        <slot></slot>
    </bk-tag>

    <!--    <span class="status" style="background-color: rgb(80, 176, 122)" v-if="props.row.status === '已通过'">{{props.row.status}}</span>-->
    <!--    <span class="status" style="background-color: rgb(234, 81, 81)" v-if="props.row.status === '不通过'">{{props.row.status}}</span>-->
    <!--    <span class="status" style="background-color: rgb(255, 149, 181)" v-if="props.row.status === '草稿'">{{props.row.status}}</span>-->

</template>
<script>
    export default {
        name: 'deal-button',
        props: {
            text: {
                type: String,
                default: () => 'deal-button'
            },
            extCls: {
                type: String,
                default: () => ''
            }
        },
        data () {
            return {
                dealStatus: {
                    0: '待审核',
                    1: '已通过',
                    2: '不通过',
                    3: '草稿'
                },
                cls: {
                    0: 'ing',
                    1: 'success',
                    2: 'fail',
                    3: 'drafting'
                }
            }
        }
    }
</script>
<style scoped>
    .status {
        background-color: #363636;
        color: white;
        display: inline-block;
        width: 60px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        border-radius: 60px/60px;
    }

    .deal-status {
        .ing {
            background-color: rgb(86, 137, 203);
        }

        .success {
            background-color: rgb(80, 176, 122);
        }

        .fail {
            background-color: rgb(234, 81, 81);
        }

        .drafting {
            background-color: rgb(255, 149, 181);
        }

    }

</style>
