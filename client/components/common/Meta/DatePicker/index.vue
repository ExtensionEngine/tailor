<template>
  <div class="d-flex">
    <date-picker
      @change="setDate"
      :value="date"
      :label="meta.label"
      :placeholder="meta.placeholder" />
    <time-picker
      v-if="date && (meta.type === 'DATETIME')"
      @change="setTime"
      :value="date"
      :disabled="!date" />
    <v-btn
      v-if="date"
      @click="date = null"
      icon
      class="ml-1 my-2">
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </div>
</template>

<script>
import DatePicker from './DatePicker';
import set from 'date-fns/set';
import TimePicker from './TimePicker';

export default {
  props: {
    meta: { type: Object, default: () => ({ value: null }) }
  },
  data: vm => ({ date: vm.meta.value && new Date(vm.meta.value) }),
  methods: {
    setDate(input) {
      input = new Date(input);
      this.date = set(this.date || new Date().setHours(0, 0, 0, 0), {
        date: input.getDate(),
        month: input.getMonth(),
        year: input.getFullYear()
      });
    },
    setTime(input) {
      if (!this.date) throw new Error('Date must be set first...');
      const [hours, minutes] = input.split(':').map(Number);
      this.date = set(this.date, { hours, minutes });
    }
  },
  watch: {
    date(val) {
      this.$emit('update', this.meta.key, val && val.toUTCString());
    }
  },
  components: { DatePicker, TimePicker }
};
</script>
