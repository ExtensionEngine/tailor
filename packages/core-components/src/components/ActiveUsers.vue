<template>
  <div class="d-flex align-center">
    <v-avatar
      v-for="{ id, label, imgUrl } in users"
      :key="id"
      :size="size"
      color="pink accent-2"
      class="avatar">
      <v-tooltip bottom>
        <template #activator="{ on }">
          <img
            v-if="imgUrl"
            v-on="on"
            :src="imgUrl"
            :alt="label"
            :aria-describedby="`activeUser-${ id }`"
            tabindex="0">
        </template>
        <span :id="`activeUser-${ id }`">{{ label }}</span>
      </v-tooltip>
    </v-avatar>
  </div>
</template>

<script>
import capitalize from 'lodash/capitalize';

export default {
  name: 'tailor-active-users',
  props: {
    users: { type: Array, default: () => [] },
    size: { type: Number, default: 36 }
  },
  filters: {
    capitalize
  }
};
</script>

<style lang="scss" scoped>
.avatar {
  transition: all 0.2s;

  img {
    padding: 0.125rem;
  }

  &:hover, &:focus-within {
    transform: scale(1.1);
    z-index: 1;

    img:focus {
      outline: none;
    }
  }
}
</style>
