<template>
  <v-card class="elevation-2">
    <v-card-title class="header elevation-2 primary">
      <v-icon>mdi-pencil</v-icon>
      <h4 class="title">Edit Profile</h4>
    </v-card-title>
    <user-general/>
  </v-card>
</template>

<script>
import UserGeneral from './UserGeneral';

export default {
  components: { UserGeneral }
};
</script>

<style lang="scss" scoped>
$color: #fff;

.header {
  height: 55px;
  color: $color;

  .title {
    margin: 0 8px;
    font-weight: 300;
  }

  .v-icon {
    margin-right: 8px;
    color: inherit;
  }
}
</style>
