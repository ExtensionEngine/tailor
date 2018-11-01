<template>
  <div :key="id" class="element-toolbar-wrapper">
    <component :is="componentName" :element="element" @save="saveElement"/>
    <div class="delete-element">
      <span @click="requestDeleteConfirmation" class="btn btn-fab btn-danger">
        <span class="mdi mdi-delete"></span>
      </span>
    </div>
  </div>
</template>

<script>
import { getElementId, getToolbarName } from './utils';
import EventBus from 'EventBus';
import get from 'lodash/get';
import { mapActions } from 'vuex-module';

const appBus = EventBus.channel('app');

export default {
  name: 'element-toolbar-wrapper',
  props: {
    element: { type: Object, required: true }
  },
  computed: {
    id() {
      return getElementId(this.element);
    },
    componentName() {
      return getToolbarName(this.element.type);
    }
  },
  methods: {
    ...mapActions({ saveElement: 'save', removeElement: 'remove' }, 'tes'),
    remove(element) {
      // Special case the deletion of tables
      // so it's possible to delete them from cells as well
      if (element.type === 'TABLE-CELL') {
        const tableElement = find(this.tes, te => !!get(te, `data.embeds.${element.id}`));
        this.removeElement(tableElement);
        this.focusoutElement();
        return;
      }

      if (element.embedded) {
        appBus.emit('deleteElement', element);
      } else {
        this.removeElement(element);
      }

      this.focusoutElement();
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
      $elementBus: EventBus.channel(`element:${this.id}`)
    };
  }
};
</script>

<style lang="scss" scoped>
.toolbar-container {
  position: absolute;
  width: 100%;
  z-index: 999;
}

.delete-element {
  position: absolute;
  z-index: 999;
  right: 0;
  transform: translate(-90%, -55%);

  .btn {
    font-size: 26px;
    line-height: 48px;
    vertical-align: middle;
  }
}
</style>
