<template>
  <div class="v-flex">
    <date-picker
      @change="setDate"
      :value="date"
      :label="meta.label"
      :placeholder="meta.placeholder" />
    <time-picker v-if="hasTime" @change="setTime" :time="date" :disabled="!date" />
  </div>
</template>

<script>
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';

const DATETIME = 'DATETIME';

const addHoursAndMinutes = (date, hours, minutes) => {
  const newDate = new Date(date);
  newDate.setHours(hours, minutes);
  return newDate.toISOString();
};

export default {
  props: {
    meta: { type: Object, default: () => ({ value: null }) }
  },
  data() {
    return {
      date: this.meta.value,
      dateMenu: false,
      timeMenu: false
    };
  },
  computed: {
    hasTime: vm => vm.meta.type === DATETIME
  },
  methods: {
    setDate(val) {
      if (this.date) {
        const old = new Date(this.date);
        this.date = addHoursAndMinutes(val, old.getHours(), old.getMinutes());
      } else {
        this.date = val;
      }
      this.$emit('update', this.meta.key, this.date);
    },
    setTime(val) {
      const [hours, minutes] = val.split(':').map(Number);
      this.date = addHoursAndMinutes(new Date(this.date), hours, minutes);
      this.$emit('update', this.meta.key, this.date);
    }
  },
  components: { DatePicker, TimePicker }
};
</script>
