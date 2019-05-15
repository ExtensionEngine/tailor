<template>
  <v-container>
    <v-layout align-start justify-center>
      <v-card>
        <sidebar/>
      </v-card>
      <v-flex ml-5 mt-4 xs12 sm10 md8>
        <router-view/>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Sidebar from './Sidebar';
import Settings from './Settings';
import UserPrivacy from './UserPrivacy';

export default {
  components: { Sidebar, Settings, UserPrivacy }
};
</script>
