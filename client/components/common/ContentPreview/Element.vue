<template>
  <div
    @click="toggleSelection"
    :class="['element-preview-container', elementWidth]">
    <v-checkbox
      v-if="selectable"
      @click.prevent
      :input-value="isSelected"
      :disabled="disabled" />
    <v-hover v-slot:default="{ hover }">
      <div class="element-wrapper">
        <content-element
          :element="element"
          :class="['content-element', { selected: isSelected }]"
          :set-width="false"
          v-bind="$attrs" />
        <v-tooltip open-delay="400" top>
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              @click.stop="$emit('element:open', element.uid)"
              color="pink darken-1"
              fab small dark
              :class="['open-element-button', { visible: hover }]">
              <v-icon small dark>mdi-open-in-new</v-icon>
            </v-btn>
          </template>
          <span>Open in editor</span>
        </v-tooltip>
      </div>
    </v-hover>
  </div>
</template>

<script>
import ContentElement from '@/components/common/tce-core/ContentElement';
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
  margin: 0.5rem 0;

  .v-input {
    margin: 0;
  }
}

.content-element {
  flex: 1 0;

  &.selected {
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
  flex-grow: 1;
}

.open-element-button {
  position: absolute;
  top: 0.5rem;
  right: -1.25rem;
  transition: opacity 0.5s;

  &:not(.visible) {
    opacity: 0;
  }
}
</style>
