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
import { mapChannels } from '@/plugins/radio';
import throttle from 'lodash/throttle';

export default {
  name: 'teaching-element',
  inheritAttrs: false,
  props: {
    element: { type: Object, required: true },
    disabled: { type: Boolean, default: false },
    dragged: { type: Boolean, default: false }
  },
  computed: mapChannels({ editorChannel: 'editor' }),
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
        .then(() => this.showNotification());
    },
    showNotification: throttle(function () {
      this.$snackbar.show('Element saved');
    }, 4000),
    remove() {
      this.removeElement(this.element).then(() => {
        this.$nextTick(() => this.editorChannel.emit('element:focus'));
      });
    }
  },
  components: { ContainedContent }
};
</script>
