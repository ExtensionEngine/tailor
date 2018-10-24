<template>
  <contained-content
    :element="element"
    :isDragged="dragged"
    :isDisabled="disabled"
    :setWidth="setWidth"
    @save="save"/>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import ContainedContent from './toolkit/ContainedContent';
import { mapActions } from 'vuex-module';

export default {
  name: 'teaching-element',
  props: {
    element: { type: Object, required: true },
    disabled: { type: Boolean, default: false },
    dragged: { type: Boolean, default: false },
    setWidth: { type: Boolean, default: true }
  },
  methods: {
    ...mapActions({ saveElement: 'save' }, 'tes'),
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
