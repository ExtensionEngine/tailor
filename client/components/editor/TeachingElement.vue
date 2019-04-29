<template>
  <contained-content
    v-bind="$attrs"
    :element="element"
    :isDragged="dragged"
    :isDisabled="disabled"
    @add="add"
    @save="save"
    @delete="remove"/>
</template>

<script>
import { mapActions, mapMutations } from 'vuex-module';
import cloneDeep from 'lodash/cloneDeep';
import { ContainedContent } from 'tce-core';
import EventBus from 'EventBus';

const SNACKBAR_CONFIG = { color: 'blue-grey darken-3', right: true };

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
    add(element) {
      this.addElement({ ...this.element, ...cloneDeep(element) });
    },
    save(data) {
      const element = cloneDeep(this.element);
      Object.assign(element.data, data);
      if (element.embedded) return this.$emit('save', element);
      return this.saveElement(element)
        .then(() => this.$snackbar.show('Element saved', SNACKBAR_CONFIG));
    },
    remove() {
      this.removeElement(this.element).then(() => {
        this.$nextTick(() => EventBus.emit('element:focus'));
      });
    }
  },
  components: { ContainedContent }
};
</script>
