<template>
  <v-overlay
    :value="show"
    opacity="0.9"
    absolute>
    <button class="message pa-2 grey--text text--lighten-2">
      <slot>Click to preview</slot>
    </button>
  </v-overlay>
</template>

<script>
export default {
  name: 'tailor-preview-overlay',
  props: {
    show: { type: Boolean, default: false }
  }
};
</script>

<style lang="scss" scoped>
.message {
  border-radius: 2px;
  font-size: 1.125rem;
}
</style>
