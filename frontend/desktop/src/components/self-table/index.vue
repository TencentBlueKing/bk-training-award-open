<template>
    <div class="self-table">
        <bk-table size="small"
            :data="$attrs['data']"
            :pagination="$attrs['pagination']"
            :highlight-current-row="true"
            @page-change="$emit('page-change',$event)"
            @page-limit-change="$emit('page-limit-change',$event)"
            v-bkloading="{ isLoading: $attrs['loading'] ,title: '加载中' }"
            :outer-border="false"
            :header-border="false"
            header-row-class-name="table-header"
        >

            <slot></slot>
        </bk-table>
    </div>
</template>

<script>
    export default {
        name: 'self-table',
        props: {},
        data () {
            return {}
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
