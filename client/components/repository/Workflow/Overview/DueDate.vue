<template>
  <div class="due-date d-flex align-center" :class="warning">
    <v-icon
      v-if="value"
      size="16"
      class="icon mr-1">
      mdi-clock-outline
    </v-icon>
    {{ value | formatDate('mediumDate') }}
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
    value: { type: String, default: null }
  },
  data: () => ({ now: new Date() }),
  computed: {
    ...mapGetters('repository', ['workflow']),
    currentDate: vm => vm.truncateTime(new Date()),
    dueDate: vm => vm.value && new Date(vm.value),
    isWarningThresholdSoon() {
      const { dueDateWarningThreshold } = this.workflow;
      if (!this.dueDate || !dueDateWarningThreshold) return false;
      const warningThreshold = sub(this.dueDate, dueDateWarningThreshold);
      return isAfter(this.currentDate, warningThreshold);
    },
    warning() {
      if (!this.dueDate) return null;
      if (isAfter(this.currentDate, this.dueDate)) return 'elapsed';
      if (this.isWarningThresholdSoon) return 'soon';
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
@mixin set-due-date-color($color) {
  color: $color;

  .icon {
    color: $color;
    caret-color: $color;
  }
}

.due-date {
  @include set-due-date-color(#a1a1a1);

  &.elapsed {
    @include set-due-date-color(var(--v-error-darken1));
  }

  &.soon {
    @include set-due-date-color(var(--v-warning-lighten1));
  }
}
</style>
