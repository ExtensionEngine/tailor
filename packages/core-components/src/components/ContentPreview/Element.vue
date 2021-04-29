<template>
  <div :class="elementWidth" class="element-preview-container float-none">
    <v-checkbox
      v-if="selectable"
      @click="toggleSelection"
      :input-value="isSelected"
      :disabled="disabled"
      color="primary darken-4" />
    <v-hover v-slot:default="{ hover }">
      <div class="element-wrapper flex-grow-1">
        <content-element
          v-bind="$attrs"
          :element="element"
          :set-width="false"
          :class="{ selected: isSelected }"
          class="content-element" />
        <v-tooltip open-delay="400" top>
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              @click.stop="$emit('element:open', element.uid)"
              :class="{ visible: hover }"
              color="blue-grey darken-4"
              fab depressed x-small
              class="open-element-button">
              <v-icon color="secondary lighten-4" dense>mdi-open-in-new</v-icon>
            </v-btn>
          </template>
          <span>Open in editor</span>
        </v-tooltip>
      </div>
    </v-hover>
  </div>
</template>

<script>
import ContentElement from '../ContentElement.vue';
import get from 'lodash/get';

export default {
  name: 'content-element-preview',
  props: {
    element: { type: Object, required: true },
    selectable: { type: Boolean, default: false },
    isSelected: { type: Boolean, default: false },
    selectionDisabled: { type: Boolean, default: false }
  },
  computed: {
    disabled: vm => vm.selectionDisabled && !vm.isSelected,
    elementWidth: vm => `col-xs-${get(vm.element, 'data.width', 12)}`
  },
  methods: {
    toggleSelection() {
      if (!this.selectable || this.disabled) return;
      this.$emit('toggle');
    }
  },
  components: { ContentElement }
};
</script>

<style lang="scss" scoped>
.element-preview-container {
  display: flex;
  position: relative;
  margin: 0.25rem 0;

  .v-input {
    margin: 0;
  }
}

.content-element {
  flex: 1 0;
  margin: 0.4375rem 0 0 0.25rem;
  box-shadow: none;
  border: 1px solid #e1e1e1;

  &.selected {
    border-style: dashed;
    border-color: #444;

    &::after {
      display: none;
    }
  }
}

.element-preview-container ::v-deep .contained-content {
  margin: 0;

  .message span:not(.heading) {
    display: none;
  }

  .ql-editor {
    word-break: break-all;
  }
}

.element-wrapper {
  position: relative;
}

.open-element-button {
  position: absolute;
  top: 0;
  right: -0.75rem;
  transition: opacity 0.4s;

  &:not(.visible) {
    opacity: 0;
  }
}
</style>
