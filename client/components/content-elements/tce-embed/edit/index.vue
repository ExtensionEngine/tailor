<template>
  <div :style="{ height: `${height}px` }" class="tce-embed">
    <element-placeholder
      v-if="showPlaceholder"
      :is-focused="isFocused"
      name="Embed"
      icon="mdi-iframe"
      active-placeholder="Use toolbar to enter the url"
      active-icon="mdi-arrow-up" />
    <div v-else>
      <div class="content">
        <div v-show="!isFocused" class="overlay">
          <div class="message">Click to preview</div>
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
    isDragged: { type: Boolean, default: false }
  },
  computed: {
    url: vm => vm.element.data.url,
    height: vm => vm.element.data.height,
    showPlaceholder: vm => !vm.element.data.url
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
  background-color: #333;
  opacity: 0.9;

  .message {
    color: #d81a60;
    font-size: 1.375rem;
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
