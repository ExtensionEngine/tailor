<template>
  <v-card class="activity-content-loader">
    <div class="d-flex mb-10">
      <v-spacer />
      <v-skeleton-loader type="button" />
    </div>
    <v-skeleton-loader
      v-for="i in 2"
      :key="i"
      type="image"
      class="mb-3" />
    <div class="d-flex mt-10">
      <v-skeleton-loader type="button" class="mx-auto" />
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'activity-content-loader'
};
</script>

<style lang="scss" scoped>
.activity-content-loader {
  padding: 1rem 2rem 5rem;
}
</style>
