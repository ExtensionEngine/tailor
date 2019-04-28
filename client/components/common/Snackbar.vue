<template>
  <v-snackbar v-model="snackbar" :timeout="duration" :color="context.color">
    {{ context.message }}
    <v-btn @click="close" dark flat>Close</v-btn>
  </v-snackbar>
</template>

<script>
import EventBus from 'EventBus';

const appChannel = EventBus.channel('app');
const initialData = () => ({ color: '', message: '' });

export default {
  data() {
    return {
      snackbar: false,
      duration: 2500,
      context: initialData()
    };
  },
  methods: {
    show(context) {
      this.context = context;
      this.snackbar = true;
    },
    close() {
      this.context = initialData();
      this.snackbar = false;
    }
  },
  created() {
    appChannel.on('showSnackbar', this.show);
  }
};
</script>
