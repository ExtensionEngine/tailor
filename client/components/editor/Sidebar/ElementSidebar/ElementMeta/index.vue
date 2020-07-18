<template>
  <div class="element-metadata">
    <element-inputs
      v-if="inputs.length"
      :element="element"
      :inputs="inputs" />
    <element-relationships
      v-if="relationships.length && element.activityId"
      :element="element"
      :relationships="relationships" />
  </div>
</template>

<script>
import ElementInputs from './Inputs';
import ElementRelationships from './Relationships';

export default {
  name: 'element-metadata',
  props: {
    element: { type: Object, required: true },
    inputs: { type: Array, default: () => [] },
    relationships: { type: Array, default: () => [] }
  },
  components: { ElementInputs, ElementRelationships }
};
</script>
