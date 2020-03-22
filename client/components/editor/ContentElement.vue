<template>
  <contained-content
    @add="add"
    @save="save"
    @delete="remove"
    v-bind="$attrs"
    :element="element"
    :is-dragged="dragged"
    :is-disabled="disabled" />
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import cloneDeep from 'lodash/cloneDeep';
import { ContainedContent } from 'tce-core';
import EventBus from 'EventBus';
import throttle from 'lodash/throttle';

export default {
  name: 'content-element',
  inheritAttrs: false,
  props: {
    element: { type: Object, required: true },
    disabled: { type: Boolean, default: false },
    dragged: { type: Boolean, default: false }
  },
  methods: {
    ...mapActions('repository/elements', {
      saveElement: 'save',
      removeElement: 'remove'
    }),
    ...mapMutations('repository/elements', { addElement: 'add' }),
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
        this.$nextTick(() => EventBus.emit('element:focus'));
      });
    }
  },
  components: { ContainedContent }
};
</script>
