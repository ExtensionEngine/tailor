<template>
  <v-container>
    <v-layout align-start justify-center>
      <v-card>
        <sidebar/>
      </v-card>
      <v-flex xs12 sm6 md3 ml-5>
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
