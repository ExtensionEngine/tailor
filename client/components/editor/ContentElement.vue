<template>
  <div>
    <slot></slot>
    <contained-content
      @add="add"
      @save="save"
      @save:meta="meta => updateElement({ _cid: element._cid, meta })"
      @delete="remove"
      v-bind="$attrs"
      :element="element"
      :is-dragged="dragged"
      :is-disabled="disabled"
      :style="elementStyle" />
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
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
    dragged: { type: Boolean, default: false },
    elementStyle: { type: Object, default: () => null }
  },
  data: () => ({ isFocused: false }),
  computed: {
    ...mapState('activeUsers', ['sseId']),
    context() {
      const { repositoryId, activityId, contentId: elementId } = this.element;
      const { sseId } = this;
      return { repositoryId, activityId, elementId, sseId };
    }
  },
  methods: {
    ...mapActions('repository/contentElements', {
      saveElement: 'save',
      updateElement: 'update',
      removeElement: 'remove'
    }),
    ...mapActions('activeUsers', {
      addActiveUserContext: 'add',
      removeActiveUserContext: 'remove'
    }),
    ...mapMutations('repository/contentElements', { addElement: 'add' }),
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
  watch: {
    isFocused() {
      this.context.created = new Date();
      if (this.isFocused) {
        this.addActiveUserContext(this.context);
        return;
      }
      this.removeActiveUserContext(this.context);
    }
  },
  created() {
    EventBus.on('element:focus', element => {
      this.isFocused = !!element && (element.id === this.element.id);
    });
  },
  components: { ContainedContent }
};
</script>
