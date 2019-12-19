<template>
  <v-menu
    v-model="showPicker"
    :close-on-content-click="false"
    min-width="260px"
    max-width="260px"
    transition="scale-transition">
    <template v-slot:activator="{ on }">
      <v-text-field
        v-on="on"
        :value="time | formatDate('hh:mm a')"
        :disabled="disabled"
        placeholder="Set Time"
        outlined
        readonly
        class="ml-1" />
    </template>
    <v-time-picker
      v-if="showPicker"
      @change="save"
      :value="time | formatDate('HH:mm')"
      ampm-in-title
      color="primary"
      full-width />
  </v-menu>
</template>

<script>
export default {
  props: {
    time: { type: String, default: null },
    disabled: { type: Boolean, default: false }
  },
  data: () => ({ showPicker: false }),
  methods: {
    save(value) {
      this.$emit('change', value);
      this.showPicker = false;
    }
  }
};
</script>
