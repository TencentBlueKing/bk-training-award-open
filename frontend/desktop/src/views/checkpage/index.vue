<template>
    <div class="checkpage-container">
        <h2 class="depart-name mr10">{{awardName}}</h2>
        <div>
            <bk-table ext-cls="mt15 table"
                :data="tableData"
                :size="size"
                :pagination="pagination"
                @page-change="handlePageChange"
                @page-limit-change="handlePageLimitChange">
                <bk-table-column type="index" label="序号" width="80"></bk-table-column>
                <bk-table-column label="申请人" prop="apply_user" width="200"></bk-table-column>
                <bk-table-column label="申报理由" prop="source" width="350"></bk-table-column>
                <bk-table-column label="申请材料" prop="materials" width="250">
                    <template slot-scope="props">
                        <bk-button class="mr10" theme="primary" text @click="reset(props.row)">{{props.row.materials}}</bk-button>
                    </template>
                </bk-table-column>
                <bk-table-column label="评审操作" width="150">
                    <template slot-scope="props">
                        <bk-button class="mr10" theme="primary" text :disabled="props.row.source === '创建中'" @click="consent(props.row)">通过</bk-button>
                        <bk-button class="mr10" theme="primary" text @click="disconsent(props.row)">不通过</bk-button>
                    </template>
                </bk-table-column>
            </bk-table>
        </div>

        <bk-dialog v-model="exampleSetting1.primary.visible"
            theme="primary"
            :mask-close="false"
            :header-position="exampleSetting1.primary.headerPosition"
            :title="exampleSetting1.primary.title"
            @confirm="clickconfirm"
            @cancel="cancel"
        >
            <template style="height: 30px;">
                <textarea rows="3" cols="45" style="margin-bottom: 15px;" :placeholder="exampleSetting1.primary.notify"></textarea>
            </template>
            {{exampleSetting1.primary.message}}
        </bk-dialog>
    </div>
</template>

<script>
    import { tableMixins } from '@/common/mixins'

    export default {
        components: {},
        mixins: [tableMixins],
        data () {
            return {
                userInfo: null,
                size: 'small',
                departValue: '',
                awardName: '',
                remoteData: [
                ],
                mystyle: {
                    height: '15px',
                    width: '100%'
                },
                exampleSetting1: {
                    primary: {
                        visible: false,
                        headerPosition: 'left',
                        title: '',
                        message: '',
                        notify: '',
                        data: null
                    }
                }
            }
        },
        computed: {
            tableData () {
                const remoteData = this.remoteData

                return remoteData?.map?.(item => {
                    return {

                    }
                })
            }
        },
        created () {
        },
        methods: {
            handlePageLimitChange () {
                console.log('handlePageLimitChange', arguments)
            },
            handlePageChange (page) {
                this.pagination.current = page
            },
            /**
             * 点击评审通过
             */
            consent (item) {
            },
            /**
             * 点击评审不通过
             */
            disconsent (item) {
            },
            listChange (list) {
                console.log(list)
            },
            /**
             * 弹框确认键
             */
            clickconfirm () {
            },
            /**
             * 弹框取消后
             */
            cancel () {
            }
        }
    }
</script>

<style lang="postcss" scoped>
    @import './index.css';
    @import '@/css/mixins/scroll.css';
    .checkpage-container{
      .table{
        ::v-deep .bk-table-body-wrapper{
          @mixin scroller #e6e9ea 4px;
        }
      }
    }
</style>
