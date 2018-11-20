<template>
  <div class="sidebar">
    <div v-if="config.type">
      <h3>{{ config.label }} Metadata</h3>
      <div class="meta-element">
        <meta-input
          v-for="it in metadata"
          :key="`${element._cid}.${it.key}`"
          :meta="it"
          @update="updateElement">
        </meta-input>
      </div>
    </div>
    <div v-else><h4>This element has no metadata options.</h4></div>
  </div>
</template>

<script>
import { mapActions } from 'vuex-module';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import map from 'lodash/map';
import MetaInput from 'components/common/Meta';

export default {
  name: 'sidebar',
  props: {
    config: { type: Object, required: true },
    element: { type: Object, required: true }
  },
  computed: {
    metadata() {
      if (!get(this.config, 'meta')) return [];
      return map(this.config.meta, it => {
        const value = get(this.element, `meta.${it.key}`);
        return { ...it, value };
      });
    }
  },
  methods: {
    ...mapActions(['update'], 'tes'),
    updateElement(key, value) {
      let meta = cloneDeep(this.element.meta) || {};
      meta[key] = value;
      return this.update({ _cid: this.element._cid, meta });
    }
  },
  components: { MetaInput }
};
</script>

<style lang="scss" scoped>
.sidebar {
  position: absolute;
  top: 100px;
  right: 0;
  bottom: 0;
  width: 300px;
  padding-top: 75px;
  padding-left: 20px;
  text-align: left;
  background: white;
  box-shadow: 0 10px 20px rgba(0,0,0,0.2), 0 8px 8px rgba(0,0,0,0.18);
  z-index: 998;
}
</style>
