<template>
  <v-list v-if="relationships.length">
    <relationship-type
      v-for="relationship in relationships"
      :key="`${element._cid}.${relationship.type}`"
      :element="element"
      :relationship="relationship" />
  </v-list>
</template>

<script>
import RelationshipType from './Item';

export default {
  name: 'relationship-types',
  props: {
    element: { type: Object, required: true },
    relationships: { type: Array, default: () => [] }
  },
  components: {
    RelationshipType
  }
};
</script>
