<template>
  <modal :show="visible" class="modal">
    <div slot="header"></div>
    <div slot="body">
      <div class="row">
        <content-element
          v-for="it in elements"
          :key="it.id"
          :element="it"
          :is-disabled="true"
          :frame="false" />
      </div>
    </div>
    <div slot="footer">
      <button @click="visible = false" class="btn btn-primary" type="button">
        Close
      </button>
    </div>
  </modal>
</template>

<script>
import { ContentElement } from 'tce-core';
import Modal from './Modal';

export default {
  name: 'tce-modal-preview',
  props: {
    elements: { type: Array, default: () => ([]) }
  },
  data() {
    return { visible: false };
  },
  watch: {
    visible(val) {
      if (!val) setTimeout(() => this.$emit('close'), 0);
    }
  },
  mounted() {
    this.visible = true;
  },
  components: {
    ContentElement,
    Modal
  }
};
</script>

<style lang="scss" scoped>
.modal /deep/ .modal-header {
  display: none;
}

.modal /deep/ .modal-body {
  padding: 0 8px;
}

.modal.in[backdrop] {
  background-color: rgba(0,0,0,0.4);
}
</style>
