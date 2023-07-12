<template>
  <transition name="message-transition">
    <div v-if="!!error" class="input-error">
      {{ error }}
    </div>
  </transition>
</template>

<script>
export default {
  name: 'tailor-input-error',
  props: {
    error: { type: String, default: '' }
  }
};
</script>

<style lang="scss" scoped>
.input-error {
  font-size: 0.75rem;
  color: var(--v-error-base);
}
</style>
