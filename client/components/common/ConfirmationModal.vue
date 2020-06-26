<template>
  <tailor-dialog v-model="show" header-icon="mdi-alert">
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
import EventBus from 'EventBus';
import { focus } from 'vue-focus';
import TailorDialog from '@/components/common/TailorDialog';

const appChannel = EventBus.channel('app');
const defaultData = () => ({ title: '', message: '' });

export default {
  data: () => ({ show: false, context: defaultData() }),
  methods: {
    open(context) {
      this.context = context;
      this.show = true;
    },
    close() {
      this.show = false;
      this.context = defaultData();
    },
    confirm() {
      this.context.action();
      this.close();
    }
  },
  created() {
    appChannel.on('showConfirmationModal', this.open);
  },
  directives: { focus },
  components: { TailorDialog }
};
</script>
