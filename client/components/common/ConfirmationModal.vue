<template>
  <v-dialog v-model="show" width="500">
    <v-card>
      <v-card-title class="headline">{{ context.title }}</v-card-title>
      <v-card-text class="text-sm-left">{{ context.message }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="close" flat>Close</v-btn>
        <v-btn v-focus="show" @click="confirm" color="error" flat>Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { focus } from 'vue-focus';
import { mapChannels } from '@/plugins/radio';
import Modal from './Modal';

const createContext = () => ({
  title: '',
  message: ''
});

export default {
  data: () => ({
    show: false,
    context: createContext()
  }),
  computed: mapChannels({ appChannel: 'app' }),
  methods: {
    open(context) {
      this.context = context;
      this.show = true;
    },
    close() {
      this.show = false;
      this.context = createContext();
    },
    confirm() {
      this.context.action();
      this.close();
    }
  },
  created() {
    this.appChannel.reply('showConfirmationModal', this.open);
  },
  directives: { focus },
  components: { Modal }
};
</script>
