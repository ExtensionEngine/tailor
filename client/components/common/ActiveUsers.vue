<template>
  <div class="d-flex align-center px-2">
    <v-avatar
      v-for="{ id, email, palette, imgUrl } in users"
      :key="id"
      :color="palette.background"
      :style="{ boxShadow: `0 0 0 2px ${palette.border}` }"
      :size="size">
      <img v-if="imgUrl" :src="imgUrl">
      <span v-else :style="{ color: palette.text }">
        {{ email[0] | capitalize }}
      </span>
    </v-avatar>
  </div>
</template>

<script>
import capitalize from 'lodash/capitalize';

export default {
  name: 'active-users',
  props: {
    users: { type: Array, default: () => [] },
    size: { type: Number, default: 30 }
  },
  filters: {
    capitalize
  }
};
</script>

<style scoped lang="scss">
.v-avatar:first-of-type {
  margin-left: 0;
  transition: all 0.2s;
}
</style>
