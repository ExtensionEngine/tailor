<template>
  <div class="due-date d-flex align-center" :class="warning">
    <v-icon size="16" class="icon mr-1">mdi-clock-outline</v-icon>
    <span class="text-no-wrap">{{ value | formatDate('mediumDate') }}</span>
  </div>
</template>

<script>
import isAfter from 'date-fns/isAfter';
import { mapGetters } from 'vuex';
import sub from 'date-fns/sub';

export default {
  name: 'overview-due-date',
  inheritAttrs: false,
  props: {
    value: { type: String, required: true }
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
      return isAfter(this.currentDate, warningStartDate);
    },
    warning() {
      if (isAfter(this.currentDate, this.dueDate)) return 'elapsed';
      if (this.didWarningThresholdElapse) return 'soon';
      return null;
    }
  },
  methods: {
    truncateTime(dateTime) {
      const year = dateTime.getFullYear();
      const month = dateTime.getMonth() + 1;
      const day = dateTime.getDate();
      return new Date(`${year}-${month}-${day}`);
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
    @include set-color(var(--v-warning-lighten1));
  }
}
</style>
