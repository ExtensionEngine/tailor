<template>
  <div class="row courses-list">
    <div class="col-md-4">
      <card></card>
    </div>

    <div class="col-md-4">
      <card></card>
    </div>

    <div class="col-md-4">
      <card></card>
    </div>
  </div>
</template>

<script>
  import Card from './Card';

  export default {
    name: 'courses-list',

    components: {
      Card
    }
  };
</script>

<style lang="scss">
  .courses-list {
    padding: 60px 40px 0;
  }
</style>
