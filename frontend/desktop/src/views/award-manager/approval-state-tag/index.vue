<template>
    <span :title="approvalStateCn"
        v-text="approvalStateCn"
        :class="['status',approvalStateEn]"
    ></span>
</template>

<script>
    export default {
        name: 'approval-state-tag',
        props: {
            approvalStateCn: {
                type: String,
                default: () => ''
            },
            approvalStateEn: {
                type: String,
                default: () => ''
            }
        }
    }
</script>

<style lang="postcss" scoped>

$fontWeightColor: #737987;

$primaryColor: #3c96ff;

$successColor: #34d97b;

$dangerColor: #ff5656;

$warningColor: #ffb400;

.status {
  cursor: pointer;
  &.review_pending {
    color: $fontWeightColor
  }

  &.review_passed {
    color: $successColor
  }

  &.review_not_passed {
    color: $dangerColor
  }

  &.draft {
    color: $warningColor
  }
}
</style>
