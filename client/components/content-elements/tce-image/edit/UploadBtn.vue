<template>
  <v-btn
    @click="onClick"
    color="primary darken-3"
    text
    class="text-uppercase">
    <v-icon color="secondary darken-1" class="mr-2">mdi-cloud-upload-outline</v-icon>
    {{ label }}
    <input
      ref="uploadInput"
      @change="$emit('change', $event)"
      type="file"
      accept="image/*"
      class="d-none">
  </v-btn>
</template>

<script>
export default {
  name: 'image-upload-btn',
  props: {
    label: { type: String, required: true }
  },
  methods: {
    onClick() {
      this.$refs.uploadInput.click();
    }
  }
};
</script>
