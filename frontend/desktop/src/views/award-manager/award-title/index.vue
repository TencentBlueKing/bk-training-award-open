<template>
    <span class="bk-text-primary cursor-pointer hover-underline" @click="handleCheckApplicationDetail($attrs['award'])">
        <slot></slot>
    </span>
</template>
<script>
    import { AWARD_FORM_ROUTE_PATH, AWARD_TYPE_DETAIL, AWARD_TYPE_ROUTE_KEY } from '@/constants'

    export default {
        name: 'award-title',
        methods: {
            handleCheckApplicationDetail (award) {
                this.$router.push({
                    name: AWARD_FORM_ROUTE_PATH,
                    query: {
                        [AWARD_TYPE_ROUTE_KEY]: AWARD_TYPE_DETAIL,
                        award_id: award['award_id'],
                        group_id: award['award_department_id']
                    }
                })
            }
        }
    }
</script>

<style>
.hover-underline {
  &:hover {
    text-decoration: underline;
  }
}
.cursor-pointer {
  cursor: pointer;
}
</style>
