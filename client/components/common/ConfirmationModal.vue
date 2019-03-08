<template>
  <modal :show="show">
    <div slot="header">
      <h3 class="modal-title">{{ title }}</h3>
    </div>
    <div v-if="publish" slot="body">
      {{ context.message }}
    </div>
    <div v-else slot="body">
      Are you sure you want to delete
      <span v-if="context.info">{{ context.type }} <b>{{ context.info }}</b></span>
      <span v-else>this {{ context.type }}</span>?
    </div>
    <div slot="footer">
      <button
        @click="close"
        class="btn btn-material btn-default"
        type="button">
        Close
      </button>
      <button
        v-focus="show"
        @click="confirm"
        class="btn btn-material btn-danger"
        type="button">
        Confirm
      </button>
    </div>
  </modal>
</template>

<script>
import EventBus from 'EventBus';
import { focus } from 'vue-focus';
import Modal from './Modal';

const appChannel = EventBus.channel('app');
const defaultData = { item: {}, type: '', message: '', info: '' };

export default {
  data() {
    return {
      show: false,
      context: defaultData
    };
  },
  computed: {
    publish() {
      return this.context.type === 'publish';
    },
    title() {
      if (this.publish) return `Publish`;
      else return `Delete ${this.context.type}?`;
    }
  },
  methods: {
    open(context) {
      this.context = context;
      this.show = true;
    },
    close() {
      this.show = false;
      this.context = defaultData;
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
  components: { Modal }
};
</script>

<style lang="scss" scoped>
.modal-body b {
  text-transform: uppercase;
}
</style>
