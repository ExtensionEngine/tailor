<template>
  <div>
    <button @click="showModal = true" class="btn btn-primary" type="button">
      {{ title }}
    </button>
    <modal :show.sync="showModal" :backdrop="false">
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
        <button @click="showModal = false" class="btn btn-default" type="button">
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
  props: ['title', 'elements'],
  data() {
    return {
      showModal: false
    };
  },
  components: {
    modal,
    Primitive
  }
};
</script>
