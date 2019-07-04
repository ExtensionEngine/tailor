<template>
  <div :key="id" class="element-toolbar-wrapper white elevation-1">
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
      <v-btn v-if="!embed" @click="requestDeleteConfirmation" color="error" fab dark>
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { getElementId, getToolbarName, isQuestion } from './utils';
import { mapChannels, mapRequests } from '@/plugins/radio';
import DefaultToolbar from './DefaultToolbar';
import { mapActions } from 'vuex-module';
import Vue from 'vue';
import { withValidation } from 'utils/validation';

export default {
  name: 'element-toolbar-wrapper',
  mixins: [withValidation()],
  props: {
    element: { type: Object, required: true },
    embed: { type: Object, default: null }
  },
  computed: {
    ...mapChannels({ editorChannel: 'editor' }),
    id() {
      return getElementId(this.element);
    },
    elementBus() {
      return this.$radio.channel(`element:${this.id}`);
    },
    componentName() {
      const { type } = this.element;
      if (isQuestion(type)) return;
      return getToolbarName(type);
    },
    componentExists() {
      return !!Vue.options.components[this.componentName];
    }
  },
  methods: {
    ...mapRequests('app', ['showConfirmationModal']),
    ...mapActions({ saveElement: 'save', removeElement: 'remove' }, 'tes'),
    remove(element) {
      this.focusoutElement();
      if (element.embedded) return this.elementBus.emit('delete');
      this.removeElement(element);
    },
    focusoutElement() {
      this.editorChannel.emit('element:focus');
    },
    requestDeleteConfirmation() {
      this.showConfirmationModal({
        title: 'Delete element?',
        message: 'Are you sure you want to delete element?',
        action: () => this.remove(this.element.parent || this.element)
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
.element-toolbar-wrapper {
  position: absolute;
  width: 100%;
  min-height: 45px;
}

.delete-element {
  position: absolute;
  z-index: 999;
  right: 0;
  transform: translate(-90%, -45%);

  .v-btn {
    margin: 4px;
  }
}
</style>
