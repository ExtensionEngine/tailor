<template>
  <v-card
    elevation="4"
    class="card px-4 py-3 my-2">
    <div class="caption text-left text-uppercase">
      {{ label }}
    </div>
    <h4 class="text-left card-title">
      {{ name }}
    </h4>
  </v-card>
</template>

<script>
export default {
  name: 'workflow-board-card',
  props: {
    label: { type: String, default: '' },
    name: { type: String, default: '' }
  }
};
</script>

<style lang="scss" scoped>
  .card.v-card {
    border-left: 4px solid purple;
  }
</style>
