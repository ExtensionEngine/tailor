<template>
  <div v-if="focusedElement" class="element-toolbar-wrapper">
    <component
      :is="componentName"
      :key="id"
      :element="focusedElement"/>
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
  data() {
    return { focusedElement: null };
  },
  computed: {
    id() {
      return this.focusedElement && getElementId(this.focusedElement);
    },
    componentName() {
      return this.focusedElement && getToolbarName(this.focusedElement.type);
    }
  },
  methods: {
    ...mapActions({ removeElement: 'remove' }, 'tes'),
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
        item: this.focusedElement,
        action: () => this.remove(this.focusedElement)
      });
    }
  },
  watch: {
    focusedElement(val) {
      this.$emit('toggle', !!val);
    }
  },
  created() {
    EventBus.on('element:focus', element => {
      this.focusedElement = element;
    });
  },
  provide() {
    return {
      $toolbar: EventBus.channel(`element:${this.id}`)
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
