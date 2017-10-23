<template>
  <modal :show.sync="show" :backdrop="false">
    <div slot="modal-header" class="modal-header">
      <h3 class="modal-title">Delete {{ context.type }}?</h3>
    </div>
    <div slot="modal-body" class="modal-body">
      Are you sure you want to delete
      <span v-if="info">{{ context.type }} <b>"{{ info }}"</b></span>
      <span v-else>this {{ context.type }}</span>?
    </div>
    <div slot="modal-footer" class="modal-footer">
      <button type="button" class="btn btn-default" @click="close">Close</button>
      <button type="button" class="btn btn-danger" @click="confirm">Confirm</button>
    </div>
  </modal>
</template>

<script>
import EventBus from 'EventBus';
import { modal } from 'vue-strap';

const appChannel = EventBus.channel('app');
const defaultData = { item: {}, type: '' };

export default {
  data() {
    return {
      show: false,
      context: defaultData
    };
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
  computed: {
    info() {
      return this.context.item.name;
    }
  },
  created() {
    appChannel.on('showConfirmationModal', this.open);
  },
  components: {
    modal
  }
};
</script>

<style lang="scss" scoped>
.modal {
  text-align: left;
}

.modal-header, .modal-footer {
  border: none;
}

.modal-body {
  padding-top: 0;
  padding-bottom: 5px;
  font-size: 16px;

  b {
    text-transform: uppercase;
  }
}
</style>
