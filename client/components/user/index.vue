<template>
  <v-container fluid>
    <v-layout>
      <v-card>
        <sidebar/>
      </v-card>
      <v-flex>
        <router-view/>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Settings from './Settings';
import Sidebar from './Sidebar';
import UserPrivacy from './UserPrivacy';

export default {
  components: { Sidebar, Settings, UserPrivacy }
};
</script>

<style lang="scss" scoped>
.layout {
  align-items: flex-start;
  justify-content: center;
}

.flex {
  max-width: 45%;
  margin-left: 48px;
}
</style>
