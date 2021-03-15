<template>
  <div :class="warning" class="due-date d-flex align-center">
    <v-icon v-if="icon" size="16" class="icon mr-1">mdi-clock-outline</v-icon>
    <span class="text-no-wrap">{{ value | formatDate(format) }}</span>
  </div>
</template>

<script>
import compareAsc from 'date-fns/compareAsc';
import fecha from 'fecha';
import isAfter from 'date-fns/isAfter';
import { mapGetters } from 'vuex';
import sub from 'date-fns/sub';

const isAfterOrEqual = (firstDate, secondDate) =>
  compareAsc(firstDate, secondDate) !== -1;

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
    currentDate: vm => vm.truncateTime(new Date()),
    dueDate: vm => vm.truncateTime(new Date(vm.value)),
    didWarningThresholdElapse() {
      const { dueDateWarningThreshold } = this.workflow;
      if (!dueDateWarningThreshold) return false;
      const warningStartDate = sub(this.dueDate, dueDateWarningThreshold);
      return isAfterOrEqual(this.currentDate, warningStartDate);
    },
    warning() {
      if (isAfter(this.currentDate, this.dueDate)) return 'elapsed';
      if (this.didWarningThresholdElapse) return 'soon';
      return null;
    }
  },
  methods: {
    truncateTime(dateTime) {
      const format = 'YYYY-MM-DD';
      const date = fecha.format(dateTime, format);
      return fecha.parse(date, format);
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
  @include set-color(#a1a1a1);

  &.elapsed {
    @include set-color(var(--v-error-darken1));
  }

  &.soon {
    @include set-color(var(--v-warning-base));
  }
}
</style>
