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
    <div v-else class="content">
      <preview-overlay :show="!isDisabled && !isFocused" />
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
</template>

<script>
import { ElementPlaceholder } from 'tce-core';
import PreviewOverlay from 'tce-core/PreviewOverlay';

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
    this.$elementBus.on('save', data => {
      this.$emit('save', { ...this.element.data, ...data });
    });
  },
  components: {
    ElementPlaceholder,
    PreviewOverlay
  }
};
</script>

<style lang="scss" scoped>
.tce-embed {
  position: relative;
  overflow: auto;
}

.content {
  width: 100%;
  height: 100%;
}
</style>
