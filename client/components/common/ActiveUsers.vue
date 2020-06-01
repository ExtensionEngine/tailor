<template>
  <div :class="{ vertical }" class="active-users">
    <v-avatar
      v-for="{ id, email, palette, profileImage } in activeUsers"
      :key="id"
      :color="palette.background"
      :style="{ boxShadow: `0 0 0 2px ${palette.border}` }"
      :size="size">
      <img v-if="profileImage" :src="profileImage">
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
    size: { type: Number, default: 30 },
    vertical: { type: Boolean, default: false }
  },
  data: () => ({ activeUsers: [] }),
  methods: {
    setActiveUsers(users) {
      this.activeUsers = users;
    }
  },
  watch: {
    users: {
      handler() {
        if (!this.activeUsers.length) {
          this.activeUsers = this.users;
          return;
        }
        this.setActiveUsers(this.users);
      },
      immediate: true
    }
  },
  filters: {
    capitalize
  }
};
</script>

<style scoped lang="scss">
.active-users {
  display: flex;
  align-items: center;

  div {
    margin-left: -5px;
    transition: all 0.2s;

    &:hover {
      margin-top: -5px;
      margin-left: 5px;
      z-index: 1;
    }
  }
  &.shadow-grey div { box-shadow: 0 0 0 1px #d0d0d0; }
  &.shadow-blue-grey div { box-shadow: 0 0 0 2px #4d626b; }

  &.vertical {
    flex-direction: column-reverse;

    div {
      margin-top: -5px;
      margin-left: 0;
    }

    div:hover {
      margin-right: -5px;
    }
  }
}
</style>
