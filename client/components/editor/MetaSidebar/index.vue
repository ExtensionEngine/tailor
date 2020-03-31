<template>
  <div class="sidebar px-3">
    <h3>Element settings</h3>
    <div class="meta-element">
      <meta-input
        v-for="it in metadata"
        :key="`${element._cid}.${it.key}`"
        @update="updateElement"
        :meta="it" />
    </div>
    <v-list v-if="relationships.length" class="element-relationships">
      <tes-relationship
        v-for="relationship in relationships"
        :key="`${element._cid}.${relationship.type}`"
        :element="element"
        :relationship="relationship" />
    </v-list>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import { mapActions } from 'vuex';
import MetaInput from 'components/common/Meta';
import TesRelationship from './TesRelationship';

export default {
  name: 'sidebar',
  props: {
    element: { type: Object, required: true },
    metadata: { type: Array, required: true },
    relationships: { type: Array, default: () => [] }
  },
  data() {
    return {
      sidebarMeta: cloneDeep(this.element.meta)
    };
  },
  methods: {
    ...mapActions('repository/tes', ['update']),
    updateElement(key, value) {
      this.sidebarMeta = { ...this.sidebarMeta, [key]: value };
      return this.update({
        _cid: this.element._cid,
        meta: { ...this.sidebarMeta }
      });
    }
  },
  components: { MetaInput, TesRelationship }
};
</script>

<style lang="scss" scoped>
.sidebar {
  h3 {
    margin: 4.5rem 0.3125rem 1.25rem;
    font-size: 1rem;
  }
}
</style>
