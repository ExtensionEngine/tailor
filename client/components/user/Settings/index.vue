<template>
  <v-card class="elevation-2">
    <v-card class="header elevation-2" color="primary" dark>
      <v-card-title>
        <v-icon>mdi-pencil</v-icon>
        <h4 class="title">Edit Profile</h4>
      </v-card-title>
    </v-card>
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
.header {
  height: 55px;

  .title {
    margin: 0 8px;
    font-weight: 300;
  }

  .v-icon {
    margin-right: 8px;
  }
}
</style>
