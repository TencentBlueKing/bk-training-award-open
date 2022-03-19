<template>
    <bk-table size="small"
        :data="data"
        :pagination="pagination"
        :highlight-current-row="true"
        @page-change="handleSetPage($event)"
        @page-limit-change="handleSetPageSize($event)"
        :outer-border="false"
        :header-border="false"
        header-row-class-name="table-header"
        :max-height="$attrs['max-height']"
        :height="$attrs['height']"
        v-bkloading="{ isLoading: $attrs['loading'] ,title: '请稍等,正在为您安放数据' }"
    >
        <slot></slot>
    </bk-table>
</template>

<script>
    export default {
        name: 'self-table',
        props: {
            pagination: {
                type: Object,
                default: () => ({
                    current: 1,
                    count: 0,
                    limit: 10
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
                handleSetPagination (page = this.pagination.current, size = this.pagination.limit) {
                    const config = {
                        current: page,
                        limit: size,
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
    font-style: normal;
    font-size: 14px;
    color: #1F4173;
  }
}
</style>
