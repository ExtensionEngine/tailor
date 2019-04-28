<template>
  <v-card class="elevation-2">
    <v-layout>
      <user-general/>
      <set-image/>
    </v-layout>
  </v-card>
</template>

<script>
import UserGeneral from './UserGeneral';
import SetImage from './SetImage';

export default {
  components: { SetImage, UserGeneral }
};
</script>
