<template>
  <div :class="[{ vertical }]" class="active-users">
    <v-avatar
      v-tooltip="user.email"
      v-for="user in users"
      :key="user.id"
      :color="user.palette.background"
      :style="{ boxShadow: getBorder(user) }"
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
    vertical: { type: Boolean, default: false }
  },
  methods: {
    getBorder({ palette }) {
      return `0 0 0 2px ${palette.border}`;
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
