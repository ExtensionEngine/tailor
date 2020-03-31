<template>
  <v-list>
    <relationship-type
      v-for="relationship in relationships"
      :key="`${element._cid}.${relationship.key}`"
      @save="save(relationship.key, $event)"
      v-bind="relationship" />
  </v-list>
</template>

<script>
import { mapActions } from 'vuex';
import RelationshipType from './Item';

export default {
  name: 'element-meta-relationships',
  props: {
    element: { type: Object, required: true },
    relationships: { type: Array, default: () => [] }
  },
  methods: {
    ...mapActions('repository/tes', ['update']),
    async save(key, val) {
      const element = {
        ...this.element,
        refs: { ...this.element.refs }
      };
      element.refs[key] = val;
      return this.update(element);
    }
  },
  components: {
    RelationshipType
  }
};
</script>
