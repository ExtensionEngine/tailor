<template>
  <div
    :class="[themeColor.border, { vertical }]"
    class="active-users">
    <v-avatar
      v-tooltip="user.email"
      v-for="user in users"
      :key="user.id"
      :color="themeColor.avatar"
      :size="size">
      <span :class="themeColor.text">
        {{ user.email[0].toUpperCase() }}
      </span>
    </v-avatar>
  </div>
</template>

<script>
const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
};

export default {
  name: 'active-users',
  props: {
    users: { type: Array, default: () => [] },
    theme: { type: String, default: THEMES.DARK },
    size: { type: Number, default: 30 },
    vertical: { type: Boolean, default: false }
  },
  computed: {
    themeColor() {
      const light = {
        avatar: 'grey lighten-3',
        text: 'blue-grey--text',
        border: 'shadow-grey'
      };
      const dark = {
        avatar: 'blue-grey darken-4',
        text: 'blue-grey--text text--lighten-2',
        border: 'shadow-blue-grey'
      };
      return this.theme === THEMES.LIGHT ? light : dark;
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
