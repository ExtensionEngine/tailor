<template>
  <div :key="id" class="element-toolbar-wrapper">
    <component
      v-if="componentExists"
      :is="componentName"
      :element="element"
      :embed="embed"
      @save="saveElement"/>
    <default-toolbar v-else/>
    <slot name="embed-toolbar"></slot>
    <div class="delete-element">
      <slot name="actions"></slot>
      <span @click="requestDeleteConfirmation" class="btn btn-fab btn-danger">
        <span class="mdi mdi-delete"></span>
      </span>
    </div>
  </div>
</template>

<script>
import { getElementId, getToolbarName } from './utils';
import DefaultToolbar from './DefaultToolbar';
import EventBus from 'EventBus';
import { mapActions } from 'vuex-module';
import Vue from 'vue';
import { withValidation } from 'utils/validation';

const appBus = EventBus.channel('app');

export default {
  name: 'element-toolbar-wrapper',
  mixins: [withValidation()],
  props: {
    element: { type: Object, required: true },
    embed: { type: Object, default: null }
  },
  computed: {
    id() {
      return getElementId(this.element);
    },
    elementBus() {
      return EventBus.channel(`element:${this.id}`);
    },
    componentName() {
      const { type } = this.element;
      if (type === 'ASSESSMENT') return;
      return getToolbarName(type);
    },
    componentExists() {
      return !!Vue.options.components[this.componentName];
    }
  },
  methods: {
    ...mapActions({ saveElement: 'save', removeElement: 'remove' }, 'tes'),
    remove(element) {
      this.focusoutElement();
      if (element.embedded) return this.elementBus.emit('delete');
      this.removeElement(element);
    },
    focusoutElement() {
      EventBus.emit('element:focus');
    },
    requestDeleteConfirmation() {
      appBus.emit('showConfirmationModal', {
        type: 'element',
        item: this.element,
        action: () => this.remove(this.element)
      });
    }
  },
  provide() {
    return {
      $elementBus: this.elementBus
    };
  },
  components: { DefaultToolbar }
};
</script>

<style lang="scss" scoped>
.delete-element {
  position: absolute;
  z-index: 999;
  right: 0;
  transform: translate(-90%, -55%);

  .btn {
    margin-left: 8px;
    font-size: 26px;
    line-height: 48px;
    vertical-align: middle;
  }
}
</style>
