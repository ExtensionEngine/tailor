<template>
  <div :class="[{ vertical }]" class="active-users">
    <v-avatar
      v-tooltip="getTooltip(user)"
      v-for="user in activeUsers"
      :key="user.id"
      :color="user.palette.background"
      :style="{ boxShadow: getBorder(user.palette) }"
      :size="size">
      <img v-if="user.profileImage" :src="user.profileImage"/>
      <span v-else :style="{ color: user.palette.text }">
        {{ user.email[0].toUpperCase() }}
      </span>
    </v-avatar>
  </div>
</template>

<script>
export default {
  name: 'active-users',
  props: {
    users: { type: Array, default: () => [] },
    size: { type: Number, default: 30 },
    vertical: { type: Boolean, default: false },
    rightTooltip: { type: Boolean, default: false }
  },
  data() {
    return {
      activeUsers: [],
      setter: null
    };
  },
  methods: {
    getBorder({ border }) {
      return `0 0 0 2px ${border}`;
    },
    getTooltip({ email }) {
      return {
        content: email,
        placement: this.rightTooltip ? 'right' : 'bottom.end',
        offset: this.rightTooltip ? 15 : 5
      };
    },
    setActiveUsers(users) {
      this.setter = setTimeout(() => (this.activeUsers = users), 300);
    }
  },
  watch: {
    users: {
      handler() {
        if (!this.activeUsers.length) {
          this.activeUsers = this.users;
          return;
        }
        clearTimeout(this.setter);
        this.setActiveUsers(this.users);
      },
      immediate: true
    }
  }
};
</script>

<style lang="scss">
.active-users {
  display: flex;
  align-items: center;

  div {
    margin-left: -5px;
    transition: all 0.2s;

    &:hover {
      z-index: 1;
      margin-top: -5px;
    }
  }

  &.shadow-grey div { box-shadow: 0 0 0 1px #d0d0d0; }
  &.shadow-blue-grey div { box-shadow: 0 0 0 2px #4d626b; }

  &.vertical {
    flex-direction: column;

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
