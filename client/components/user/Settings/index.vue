<template>
  <v-card class="elevation-2">
    <v-layout>
      <user-general @message="retrieveMessage"/>
      <set-image @message="retrieveMessage"/>
    </v-layout>
    <v-snackbar v-model="success" :timeout="timeout" color="success">
      Changes saved.
      <v-btn @click="success=false" dark flat>Close</v-btn>
    </v-snackbar>
    <v-snackbar v-model="error" :timeout="timeout" color="error">
      An error has occurred!
      <v-btn @click="error=false" dark flat>Close</v-btn>
    </v-snackbar>
  </v-card>
</template>

<script>
import UserGeneral from './UserGeneral';
import SetImage from './SetImage';

export default {
  data() {
    return {
      error: false,
      success: false,
      timeout: 2500
    };
  },
  methods: {
    retrieveMessage(val) {
      (!val) ? this.error = val : this.success = val;
    }
  },
  components: { SetImage, UserGeneral }
};
</script>
