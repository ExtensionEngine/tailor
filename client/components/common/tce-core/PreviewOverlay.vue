<template functional>
  <button class="overlay d-flex justify-center align-center">
    <div class="message grey--text text--lighten-2">Click to preview</div>
  </button>
</template>

<script>
export default { name: 'tce-preview-overlay' };
</script>

<style lang="scss" scoped>
.overlay {
  position: absolute;
  z-index: 3;
  width: 100%;
  height: 100%;
  background-color: #111;
  opacity: 0.9;

  &:hover {
    cursor: pointer;
  }

  .message {
    font-size: 1.125rem;
  }
}
</style>
