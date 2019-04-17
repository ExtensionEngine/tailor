<template>
  <contained-content
    v-bind="$attrs"
    :element="element"
    :isDragged="dragged"
    :isDisabled="disabled"
    @add="addElement"
    @save="save"
    @delete="removeElement(element)"/>
</template>

<script>
import { mapActions, mapMutations } from 'vuex-module';
import cloneDeep from 'lodash/cloneDeep';
import { ContainedContent } from 'tce-core';

export default {
  name: 'teaching-element',
  inheritAttrs: false,
  props: {
    element: { type: Object, required: true },
    disabled: { type: Boolean, default: false },
    dragged: { type: Boolean, default: false }
  },
  methods: {
    ...mapActions({ saveElement: 'save', removeElement: 'remove' }, 'tes'),
    ...mapMutations({ addElement: 'add' }, 'tes'),
    save(data) {
      const element = cloneDeep(this.element);
      Object.assign(element.data, data);
      return element.embedded
        ? this.$emit('save', element)
        : this.saveElement(element);
    }
  },
  components: { ContainedContent }
};
</script>
