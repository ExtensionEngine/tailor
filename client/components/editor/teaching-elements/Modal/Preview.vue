<template>
  <div>
    <modal :show.sync="visible" :backdrop="false">
      <div slot="modal-header"></div>
      <div slot="modal-body" class="modal-body">
        <div class="row">
          <primitive
            v-for="it in elements"
            :key="it.id"
            :initialElement="it"
            :disabled="true">
          </primitive>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button @click="visible = false" class="btn btn-default" type="button">
          Close
        </button>
      </div>
    </modal>
  </div>
</template>

<script>
import { modal } from 'vue-strap';
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
    modal,
    Primitive
  }
};
</script>
