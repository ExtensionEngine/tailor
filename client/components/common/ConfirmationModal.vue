<template>
  <tailor-dialog v-model="show" @click:outside="close" header-icon="mdi-alert">
    <template v-slot:header>{{ context.title }}</template>
    <template v-slot:body>
      <div class="body-1 primary--text text--darken-2 text-left">
        {{ context.message }}
      </div>
    </template>
    <template v-slot:actions>
      <v-btn @click="close" text>Close</v-btn>
      <v-btn v-focus="show" @click="confirm" color="secondary" text>Confirm</v-btn>
    </template>
  </tailor-dialog>
</template>

<script>
import { focus } from 'vue-focus';
import { mapChannels } from '@/plugins/radio';
import TailorDialog from '@/components/common/TailorDialog';

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
      this.context.onOpen();
    },
    close() {
      this.context.onClose();
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
  components: { TailorDialog }
};
</script>
