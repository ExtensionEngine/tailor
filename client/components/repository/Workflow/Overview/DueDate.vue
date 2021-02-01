<template>
  <div :class="warning">
    {{ value | formatDate('MM/DD/YY') }}
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
.elapsed {
  color: var(--v-error-darken1);
}

.soon {
  color: var(--v-warning-lighten1);
}
</style>
