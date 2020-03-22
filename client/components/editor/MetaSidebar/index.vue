<template>
  <div class="sidebar">
    <h2>Additional settings</h2>
    <div class="meta-element">
      <meta-input
        v-for="it in metadata"
        :key="`${element._cid}.${it.key}`"
        @update="updateElement"
        :meta="it" />
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import { mapActions } from 'vuex';
import MetaInput from 'components/common/Meta';

export default {
  name: 'sidebar',
  props: {
    element: { type: Object, required: true },
    metadata: { type: Array, required: true }
  },
  data() {
    return {
      sidebarMeta: cloneDeep(this.element.meta)
    };
  },
  methods: {
    ...mapActions('repository/elements', ['update']),
    updateElement(key, value) {
      this.sidebarMeta = { ...this.sidebarMeta, [key]: value };
      return this.update({
        _cid: this.element._cid,
        meta: { ...this.sidebarMeta }
      });
    }
  },
  components: { MetaInput }
};
</script>

<style lang="scss" scoped>
.sidebar {
  h2 {
    margin: 100px 5px 20px;
    font-size: 18px;
  }

  position: absolute;
  top: 50px;
  right: 0;
  bottom: 0;
  width: 380px;
  padding: 25px 0 75px 20px;
  text-align: left;
  background: white;
  box-shadow: 0 10px 20px rgba(0,0,0,0.2), 0 8px 8px rgba(0,0,0,0.18);
  overflow-y: auto;
  z-index: 98;
}
</style>
