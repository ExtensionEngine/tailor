<template>
  <modal :show.sync="show" :backdrop="false">
    <div slot="modal-header" class="modal-header">
      <h3 class="modal-title">Delete {{ data.type }}?</h3>
    </div>
    <div slot="modal-body" class="modal-body">
      Are you sure you want to delete
      <span v-if="info">{{ data.type }} <b>"{{ info }}"</b></span>
      <span v-else>this {{ data.type }}</span>?
    </div>
    <div slot="modal-footer" class="modal-footer">
      <button type="button" class="btn btn-default" @click="close">Close</button>
      <button type="button" class="btn btn-danger" @click="confirm">Confirm</button>
    </div>
  </modal>
</template>

<script>
import { modal } from 'vue-strap';
import bus from './eventBus';

const defaultData = { item: {}, type: '' };

export default {
  data() {
    return {
      show: false,
      data: defaultData
    };
  },
  methods: {
    open(data) {
      this.data = data;
      this.show = true;
    },
    close() {
      this.show = false;
      this.data = defaultData;
    },
    confirm() {
      bus.$emit(this.event, this.data.item);
      this.close();
    }
  },
  computed: {
    info() {
      return this.data.item.name;
    },
    event() {
      return `${this.data.type}/delete`;
    }
  },
  created() {
    bus.$on('show', this.open);
  },
  destroyed() {
    bus.$off();
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

.modal-header,
.modal-footer {
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
