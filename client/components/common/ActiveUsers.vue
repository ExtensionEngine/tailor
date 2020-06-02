<template>
  <div class="d-flex align-center active-users">
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
    size: { type: Number, default: 30 }
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
  padding: 0 0.25rem;

  .v-avatar:first-of-type {
    margin-left: 0;
    transition: all 0.2s;
  }
}
</style>
