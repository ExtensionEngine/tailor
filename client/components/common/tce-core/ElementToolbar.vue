<template>
  <div
    :key="id"
    class="element-toolbar-wrapper grey lighten-5 elevation-3">
    <component
      :is="componentName"
      v-if="componentExists"
      @save="saveElement"
      :element="element"
      :embed="embed" />
    <default-toolbar v-else :label="config.name" />
    <slot name="embed-toolbar"></slot>
    <div class="delete-element">
      <slot name="actions"></slot>
      <v-btn
        v-if="!embed"
        @click="requestDeleteConfirmation"
        color="secondary darken-1"
        dark fab small>
        <v-icon color="grey lighten-3">mdi-delete</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { getElementId, getToolbarName, isQuestion } from './utils';
import { mapChannels, mapRequests } from '@/plugins/radio';
import DefaultToolbar from './DefaultToolbar';
import { mapActions } from 'vuex';
import Vue from 'vue';

export default {
  name: 'element-toolbar-wrapper',
  inject: ['$teRegistry'],
  props: {
    element: { type: Object, required: true },
    embed: { type: Object, default: null }
  },
  computed: {
    ...mapChannels({ editorChannel: 'editor' }),
    id: vm => getElementId(vm.element),
    componentName() {
      if (this.isQuestion) return;
      const { type } = this.element;
      return getToolbarName(type);
    },
    isQuestion: vm => isQuestion(vm.element.type),
    elementBus: vm => vm.$radio.channel(`element:${vm.id}`),
    config() {
      const { element, isQuestion } = this;
      const type = isQuestion
        ? element.data.type
        : element.type;
      return this.$teRegistry.get(type);
    },
    componentExists() {
      return !!Vue.options.components[this.componentName];
    }
  },
  methods: {
    ...mapRequests('app', ['showConfirmationModal']),
    ...mapActions('repository/contentElements', {
      saveElement: 'save',
      removeElement: 'remove'
    }),
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
  width: 100%;
  min-height: 3.5rem;
  padding-right: 2.75rem;

  .delete-element {
    position: absolute;
    right: 1.25rem;
    bottom: 1rem;
  }
}
</style>
