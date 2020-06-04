<template>
  <div class="d-flex align-center px-2">
    <v-avatar
      v-for="{ id, fullName, email, palette, imgUrl } in users"
      :key="id"
      :color="palette.background"
      :style="{ boxShadow: `0 0 0 2px ${palette.border}` }"
      :size="size"
      class="avatar">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <img v-if="imgUrl" v-on="on" :src="imgUrl" tabindex="0">
        </template>
        <span>{{ fullName }}</span>
      </v-tooltip>
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
.avatar {
  &:hover, &:focus-within {
    transform: scale(1.1);
    z-index: 1;

    img:focus {
      outline: none;
    }
  }

  &:first-of-type {
    margin-left: 0;
    transition: all 0.2s;
  }
}
</style>
