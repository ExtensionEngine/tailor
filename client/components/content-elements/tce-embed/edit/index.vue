<template>
  <div :style="style" class="tce-embed">
    <element-placeholder
      v-if="showPlaceholder"
      :is-focused="isFocused"
      :is-disabled="isDisabled"
      :dense="dense"
      name="Embed component"
      icon="mdi-iframe"
      active-placeholder="Use toolbar to enter the url"
      active-icon="mdi-arrow-up" />
    <div v-else>
      <div class="content">
        <div v-show="!isDisabled && !isFocused" class="overlay">
          <div class="message grey--text text--lighten-2">Click to preview</div>
        </div>
        <!-- Dragging iframes is not supported inside sortablejs container! -->
        <iframe
          v-if="!isDragged"
          ref="frame"
          :src="url"
          frameborder="0"
          sandbox="allow-forms allow-same-origin allow-scripts"
          class="content">
        </iframe>
      </div>
    </div>
  </div>
</template>

<script>
import { ElementPlaceholder } from 'tce-core';

export default {
  name: 'tce-embed',
  inject: ['$elementBus'],
  props: {
    element: { type: Object, required: true },
    isFocused: { type: Boolean, default: false },
    isDragged: { type: Boolean, default: false },
    isDisabled: { type: Boolean, default: false },
    dense: { type: Boolean, default: false }
  },
  computed: {
    url: vm => vm.element.data.url,
    height: vm => vm.element.data.height,
    showPlaceholder: vm => !vm.element.data.url,
    style() {
      return this.showPlaceholder ? {} : { height: `${this.height}px` };
    }
  },
  mounted() {
    this.$elementBus.on('save', data => this.$emit('save', data));
  },
  components: {
    ElementPlaceholder
  }
};
</script>

<style lang="scss" scoped>
.tce-embed {
  position: relative;
  overflow: auto;
}

.overlay {
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: center;
  position: absolute;
  z-index: 3;
  width: 100%;
  height: 100%;
  background-color: #111;
  opacity: 0.9;

  .message {
    font-size: 1.125rem;
  }
}

.content {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.disabled .overlay {
  display: none;
}
</style>
