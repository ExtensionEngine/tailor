<template>
  <div :key="id" class="element-toolbar-wrapper white elevation-1">
    <component
      :is="componentName"
      v-if="componentExists"
      @save="saveElement"
      :element="element"
      :embed="embed" />
    <default-toolbar v-else />
    <slot name="embed-toolbar"></slot>
    <div class="delete-element">
      <slot name="actions"></slot>
      <v-btn
        v-if="!embed"
        @click="requestDeleteConfirmation"
        color="blue-grey darken-2"
        fab dark>
        <v-icon size="22">mdi-delete</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { getElementId, getToolbarName, isQuestion } from './utils';
import DefaultToolbar from './DefaultToolbar';
import EventBus from 'EventBus';
import { mapActions } from 'vuex';
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
  data() {
    return {
      elementBus: EventBus.channel(`element:${getElementId(this.element)}`)
    };
  },
  computed: {
    id() {
      return getElementId(this.element);
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
      EventBus.emit('element:focus');
    },
    requestDeleteConfirmation() {
      appBus.emit('showConfirmationModal', {
        title: 'Delete element?',
        message: 'Are you sure you want to delete element?',
        action: () => this.remove(this.element.parent || this.element)
      });
    }
  },
  beforeDestroy() {
    this.elementBus.unsubscribe();
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
  transform: translate(-90%, -55%);

  .v-btn {
    margin: 4px;
  }
}
</style>
