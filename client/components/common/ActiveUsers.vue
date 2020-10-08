<template>
  <div class="d-flex align-center">
    <v-avatar
      v-for="{ id, fullName, imgUrl } in users"
      :key="id"
      :size="size"
      class="avatar">
      <v-tooltip :disabled="!fullName" bottom>
        <template v-slot:activator="{ on }">
          <img
            v-if="imgUrl"
            v-on="on"
            :src="imgUrl"
            :alt="fullName"
            :aria-describedby="`activeUser-${ id }`"
            tabindex="0">
        </template>
        <span :id="`activeUser-${ id }`">{{ fullName }}</span>
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
    size: { type: Number, default: 32 }
  },
  filters: {
    capitalize
  }
};
</script>

<style lang="scss" scoped>
.avatar {
  box-shadow: 0 0 0 2px #b0bec5;
  transition: all 0.2s;

  &:hover, &:focus-within {
    transform: scale(1.1);
    z-index: 1;

    img:focus {
      outline: none;
    }
  }
}
</style>
