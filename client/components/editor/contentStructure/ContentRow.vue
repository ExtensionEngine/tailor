<template>
  <div class="content-row">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'content-row'
};
</script>

<style lang="scss">
.content-row {
  margin-top: 10px;
  padding: 5px;
  border: 1px dashed #aaa;
  cursor: pointer;
}
</style>
