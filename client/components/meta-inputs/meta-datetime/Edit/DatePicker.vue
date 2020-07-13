<template>
  <v-menu
    v-model="showDialog"
    :close-on-content-click="false"
    min-width="290px"
    transition="scale-transition">
    <template v-slot:activator="{ on }">
      <v-text-field
        v-on="on"
        @click:append="showDialog = true"
        :value="value | formatDate('MMM D, YYYY')"
        :label="label"
        :placeholder="placeholder"
        outlined
        readonly />
    </template>
    <v-date-picker
      @input="$emit('change', $event);"
      @change="showDialog = false"
      :value="value | formatDate('YYYY-MM-DD')"
      color="primary"
      no-title />
  </v-menu>
</template>

<script>
export default {
  name: 'date-picker',
  props: {
    value: { type: Date, default: null },
    label: { type: String, default: null },
    placeholder: { type: String, default: 'Click to set...' }
  },
  data: () => ({ showDialog: false })
};
</script>
