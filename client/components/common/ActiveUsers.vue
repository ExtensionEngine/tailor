<template>
  <div class="active-users">
    <v-avatar
      v-tooltip="user.firstName + ' ' + user.lastName"
      v-for="user in users"
      :key="user.id"
      size="30"
      color="#eaeaea">
      <span class="grey--text">
        {{ user.firstName[0] }}
      </span>
    </v-avatar>
  </div>
</template>

<script>
export default {
  name: 'active-users',
  computed: {
    users() {
      return [
        { id: 1, firstName: 'Ilija', lastName: 'Veselica' },
        { id: 2, firstName: 'Toma', lastName: 'Zelic' },
        { id: 3, firstName: 'Zdravko', lastName: 'Curic' }
      ];
    }
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
