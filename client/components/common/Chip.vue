<template>
  <v-chip v-on="$listeners" v-bind="$attrs" class="chip">
    <slot></slot>
  </v-chip>
</template>

<script>
export default {
  name: 'custom-chip',
  inheritAttrs: false
};
</script>

<style lang="scss" scoped>
.chip::before {
  display: none;
}
</style>
