<template>
  <div class="loader loader-inner ball-pulse">
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>

<script>
export default {
  name: 'loader'
};
</script>

<style lang="scss">
.ball-pulse > div {
  background: #888 !important;
}
</style>
