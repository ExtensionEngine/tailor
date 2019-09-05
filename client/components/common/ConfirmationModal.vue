<template>
  <v-dialog v-model="show" width="500">
    <v-card>
      <v-card-title class="headline">{{ context.title }}</v-card-title>
      <v-card-text class="text-sm-left">{{ context.message }}</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="close" flat>Close</v-btn>
        <v-btn
          v-if="context.action"
          v-focus="show"
          @click="confirm(context.action)"
          color="error" flat>
          Confirm
        </v-btn>
        <template v-if="context.actions">
          <v-btn
            v-for="({action, label}, index) in context.actions"
            :key="index"
            @click="confirm(action)"
            color="error" flat>
            {{ label }}
          </v-btn>
        </template>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import EventBus from 'EventBus';
import { focus } from 'vue-focus';

const appChannel = EventBus.channel('app');
const defaultData = () => ({ title: '', message: '' });

export default {
  data() {
    return {
      show: false,
      context: defaultData()
    };
  },
  methods: {
    open(context) {
      this.context = context;
      this.show = true;
    },
    close() {
      this.show = false;
      this.context = defaultData();
    },
    confirm(action) {
      action();
      this.close();
    }
  },
  created() {
    appChannel.on('showConfirmationModal', this.open);
  },
  directives: { focus }
};
</script>
