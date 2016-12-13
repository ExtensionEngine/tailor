<template>
  <div class="assessment multiple-choice">
    {{ test }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      test: 'init'
    };
  }
};
</script>

<style lang="scss">
.multiple-choice {
  background-color: red;
}
</style>
