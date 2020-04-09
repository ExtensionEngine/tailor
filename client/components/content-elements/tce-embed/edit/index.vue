<template>
  <div :style="{ height: `${height}px` }" class="tce-embed">
    <v-sheet v-if="showPlaceholder" class="pa-12">
      <v-avatar size="60" color="blue-grey darken-4">
        <v-icon :size="isFocused ? 36 : 30" color="white">mdi-iframe</v-icon>
      </v-avatar>
      <div class="headline my-4">Embed component</div>
      <div class="subtitle-1">
        <template v-if="!isFocused">Select to edit</template>
        <template v-else>
          Use toolbar
          <v-icon size="22" color="secondary">mdi-transfer-up</v-icon>
          to enter url
        </template>
      </div>
    </v-sheet>
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
