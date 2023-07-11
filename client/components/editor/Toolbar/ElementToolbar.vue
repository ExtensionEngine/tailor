<template>
  <div
    :key="id"
    class="element-toolbar-wrapper grey lighten-5 elevation-3">
    <component
      :is="componentName"
      v-if="componentExists"
      @save="save"
      :element="element"
      :embed="embed" />
    <default-toolbar v-else :label="config.name" />
    <slot name="embed-toolbar"></slot>
    <div class="actions-container">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script>
import { getElementId, getToolbarName, isQuestion } from '@tailor-cms/utils';
import DefaultToolbar from './DefaultToolbar.vue';
import { mapActions } from 'vuex';
import { mapChannels } from '@extensionengine/vue-radio';
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
  methods: mapActions('repository/contentElements', ['save']),
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
  z-index: 99;
  width: 100%;
  min-height: 3.5rem;
  padding-right: 2.75rem;

  .actions-container {
    position: absolute;
    right: 1.25rem;
    bottom: 1rem;
  }
}
</style>
