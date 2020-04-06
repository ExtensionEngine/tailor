<template>
  <div>
    <v-btn
      @click="onClick"
      color="primary darken-3"
      text
      class="text-uppercase">
      <v-icon color="secondary darken-1" class="mr-2">mdi-image-outline</v-icon>
      Click to upload an image
    </v-btn>
    <input
      ref="uploadInput"
      @change="$emit('change', $event)"
      type="file"
      accept="image/*"
      class="d-none">
  </div>
</template>

<script>
export default {
  name: 'image-upload-btn',
  methods: {
    onClick() {
      this.$refs.uploadInput.click();
    }
  }
};
</script>
