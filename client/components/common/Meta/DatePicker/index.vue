<template>
  <div class="d-flex">
    <date-picker
      @change="setDate"
      :value="date"
      :label="meta.label"
      :placeholder="meta.placeholder" />
    <time-picker
      v-if="meta.type === 'DATETIME'"
      @change="setTime"
      :value="date"
      :disabled="!date" />
    <v-btn
      v-if="date"
      @click="date = null"
      icon
      class="ml-1 py-4">
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
      this.date = set(this.date || new Date(), {
        date: input.getDate(),
        month: input.getMonth(),
        year: input.getFullYear()
      });
    },
    setTime(input) {
      const [hours, minutes] = input.split(':').map(Number);
      this.date = set(this.date || new Date(), { hours, minutes });
    }
  },
  watch: {
    date(val) {
      this.$emit('update', this.meta.key, val && val.toISOString());
    }
  },
  components: { DatePicker, TimePicker }
};
</script>
