<template>
  <v-menu
    v-model="showDialog"
    :close-on-content-click="false"
    min-width="260px"
    max-width="260px"
    transition="scale-transition">
    <template v-slot:activator="{ on }">
      <v-text-field
        v-on="on"
        :value="value | formatDate('hh:mm a')"
        :disabled="disabled"
        placeholder="Set time..."
        outlined readonly
        class="ml-1" />
    </template>
    <v-time-picker
      v-if="showDialog"
      @input="$emit('change', $event);"
      @change="showDialog = false"
      :value="value | formatDate('HH:mm')"
      color="primary"
      full-width no-title />
  </v-menu>
</template>

<script>
export default {
  props: {
    value: { type: Date, default: null },
    disabled: { type: Boolean, default: false }
  },
  data: () => ({ showDialog: false })
};
</script>
