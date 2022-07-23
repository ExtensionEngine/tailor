<template>
  <v-menu
    v-model="showDatePicker"
    :close-on-content-click="false"
    min-width="290px"
    transition="scale-transition">
    <template #activator="{ on }">
      <v-text-field
        ref="textField"
        v-on="on"
        @click:clear="clear"
        @click="showDatePicker = true"
        :value="value | formatDate('MMM D, YYYY')"
        :label="label"
        :placeholder="placeholder"
        :clearable="clearable"
        outlined
        readonly />
    </template>
    <v-date-picker
      @input="$emit('input', $event)"
      @change="showDatePicker = false"
      :value="value | formatDate('YYYY-MM-DD')"
      color="primary darken-2"
      no-title />
  </v-menu>
</template>

<script>
export default {
  name: 'date-picker',
  props: {
    value: { type: [String, Date], default: null },
    label: { type: String, default: null },
    clearable: { type: Boolean, default: true },
    placeholder: { type: String, default: 'Click to set...' }
  },
  data: () => ({ showDatePicker: false }),
  methods: {
    clear() {
      this.$emit('input', null);
      this.$refs.textField.blur();
    }
  }
};
</script>
