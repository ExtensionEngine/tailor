<template>
  <v-chip v-on="$listeners" v-bind="$attrs" :input-value="true">
    <slot></slot>
  </v-chip>
</template>

<script>
export default {
  name: 'tailor-chip',
  inheritAttrs: false
};
</script>
