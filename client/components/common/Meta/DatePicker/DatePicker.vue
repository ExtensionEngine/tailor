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
        :value="value | formatDate('MMM D, YYYY')"
        :label="label"
        :placeholder="placeholder"
        outlined
        readonly />
    </template>
    <v-date-picker
      @input="save"
      :value="value | formatDate('YYYY-MM-DD')"
      color="primary"
      no-title />
  </v-menu>
</template>

<script>
export default {
  name: 'date-picker',
  props: {
    label: { type: String, default: null },
    value: { type: String, default: null },
    placeholder: { type: String, default: 'Set Date' }
  },
  data: () => ({ show: false }),
  methods: {
    save(value) {
      this.$emit('change', value);
      this.show = false;
    }
  }
};
</script>
