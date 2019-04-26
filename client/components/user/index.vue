<template>
  <v-container>
    <v-layout row align-start>
      <v-card>
        <sidebar/>
      </v-card>
      <v-flex ml-4>
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
