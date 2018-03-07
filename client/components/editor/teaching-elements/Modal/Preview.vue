<template>
  <modal :show="visible" class="modal">
    <div slot="header"></div>
    <div slot="body">
      <div class="row">
        <primitive
          v-for="it in elements"
          :key="it.id"
          :initialElement="it"
          :disabled="true">
        </primitive>
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
import Modal from 'components/common/Modal';
import Primitive from '../Primitive';

export default {
  name: 'te-modal-preview',
  props: ['elements'],
  data() {
    return { visible: false };
  },
  mounted() {
    this.visible = true;
  },
  watch: {
    visible(val) {
      if (!val) setTimeout(() => this.$emit('close'), 0);
    }
  },
  components: {
    Modal,
    Primitive
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
