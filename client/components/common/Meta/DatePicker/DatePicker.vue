<template>
  <v-menu
    v-model="show"
    :close-on-content-click="false"
    min-width="290px"
    transition="scale-transition">
    <template v-slot:activator="{ on }">
      <v-text-field
        v-on="on"
        @click:append="show = true"
        :value="displayedValue"
        :label="label"
        :placeholder="placeholder"
        outlined
        readonly />
    </template>
    <v-date-picker
      ref="picker"
      @input="save"
      v-bind="$attrs"
      :value="normalizedValue"
      color="primary"
      no-title />
  </v-menu>
</template>

<script>
import fecha from 'fecha';

const NORMALIZED_FORMAT = 'YYYY-MM-DD';
const DISPLAY_FORMAT = 'MMM D, YYYY';

export default {
  name: 'date-picker',
  props: {
    label: { type: String, default: null },
    value: { type: String, default: null },
    inputFormat: { type: String, default: NORMALIZED_FORMAT },
    placeholder: { type: String, default: 'Set Date' }
  },
  data: () => ({ show: false }),
  computed: {
    normalizedValue: vm => vm.normalize(vm.value, vm.inputFormat, NORMALIZED_FORMAT),
    displayedValue() {
      return this.value && fecha.format(new Date(this.value), DISPLAY_FORMAT);
    }
  },
  methods: {
    save(value) {
      const { inputFormat } = this;
      this.$emit('change', this.normalize(value, NORMALIZED_FORMAT, inputFormat));
      this.show = false;
    },
    normalize(value, inputFormat, outputFormat) {
      if (!value) return;
      const date = fecha.parse(value, inputFormat);
      return fecha.format(date, outputFormat);
    }
  }
};
</script>
