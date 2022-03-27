<template>
    <bk-table :size="'small'"
        :data="data"
        :pagination="pagination"
        :highlight-current-row="true"
        :outer-border="false"
        :header-border="false"
        :max-height="$attrs['max-height']"
        :min-height="$attrs['min-height']"
        :height="$attrs['height']"
        @page-change="handleSetPage($event)"
        @page-limit-change="handleSetPageSize($event)"

        header-row-class-name="table-header"
        v-bkloading="{ isLoading: $attrs['loading'] ,title: '正在加载中' }"
    >
        <slot></slot>
    </bk-table>
</template>

<script>
    import { paginationTemplate } from '@/common/mixins/tableMixins'

    export default {
        name: 'self-table',
        props: {
            pagination: {
                type: Object,
                default: () => ({
                  ...paginationTemplate
                })
            },
            data: {
                type: Array,
                default: () => []
            }
        },
        data () {
            return {
                handleSetPage (page) {
                    this.handleSetPagination(page)
                },
                handleSetPageSize (size) {
                    this.handleSetPagination(1, size)
                },
                handleSetPagination (current, limit) {
                    const config = {
                        current,
                        limit,
                        count: this.pagination.count
                    }
                    this.$emit('update:pagination', config)
                    this.$emit('page-change', config)
                }
            }
        }
    }
</script>

<style scoped>
::v-deep .table-header {
  th {
    border: none;
  }

  .bk-table-header-label {
    font-size: 14px;
    color: var(--primaryColor);
  }
}
</style>
