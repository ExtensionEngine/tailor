<template>
  <div class="active-users">
    <v-avatar
      v-tooltip="user.email"
      v-for="user in users"
      :key="user.id"
      size="30"
      color="#eaeaea">
      <span class="grey--text">
        {{ user.email[0].toUpperCase() }}
      </span>
    </v-avatar>
  </div>
</template>

<script>
export default {
  name: 'active-users',
  props: {
    users: { type: Array, default: () => [] }
  }
};
</script>

<style lang="scss">
.active-users {
  display: flex;
  align-items: center;
  margin-right: 2.6rem;

  div {
    margin-left: -5px;
    transition: all 0.2s;
    box-shadow: 0 0 0 2px #fff;

    &:hover {
      z-index: 1;
      margin-top: -5px;
    }
  }
}
</style>
