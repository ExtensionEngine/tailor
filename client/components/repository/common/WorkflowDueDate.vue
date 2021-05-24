<template>
  <div
    v-on="$listeners"
    :class="{ elapsed, soon: !elapsed && didWarningThresholdElapse }"
    class="due-date d-flex align-center">
    <v-icon v-if="icon" size="16" class="icon mr-1">mdi-clock-outline</v-icon>
    <span class="text-no-wrap">{{ value | formatDate(format) }}</span>
  </div>
</template>

<script>
import { isAfterOrEqual, truncateTime } from '@/utils/date';
import isAfter from 'date-fns/isAfter';
import { mapGetters } from 'vuex';
import sub from 'date-fns/sub';

export default {
  name: 'workflow-due-date',
  inheritAttrs: false,
  props: {
    value: { type: String, required: true },
    format: { type: String, default: null },
    icon: { type: Boolean, default: false }
  },
  data: () => ({ now: new Date() }),
  computed: {
    ...mapGetters('repository', ['workflow']),
    currentDate: vm => truncateTime(new Date()),
    dueDate: vm => truncateTime(new Date(vm.value)),
    elapsed: vm => isAfter(vm.currentDate, vm.dueDate),
    didWarningThresholdElapse() {
      const { dueDateWarningThreshold } = this.workflow;
      if (!dueDateWarningThreshold) return false;
      const warningStartDate = sub(this.dueDate, dueDateWarningThreshold);
      return isAfterOrEqual(this.currentDate, warningStartDate);
    }
  }
};
</script>

<style lang="scss" scoped>
@mixin set-color($color) {
  color: $color;

  .icon {
    color: $color;
    caret-color: $color;
  }
}

.due-date {
  @include set-color(#606060);

  &.elapsed {
    @include set-color(var(--v-error-darken1));
  }

  &.soon {
    @include set-color(var(--v-warning-base));
  }
}
</style>
