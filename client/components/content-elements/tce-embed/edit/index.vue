<template>
  <div :style="{ height: `${height}px` }" class="tce-embed">
    <v-alert v-if="showPlaceholder" :style="{ height: `${height}px` }" class="placeholder">
      <div class="message">
        <span class="heading">Embed placeholder</span>
        <span v-if="!isFocused">Select to edit</span>
        <span v-else>Please use toolbar to enter url</span>
      </div>
    </v-alert>
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
          class="content"
          frameborder="0"
          sandbox="allow-forms allow-same-origin allow-scripts">
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
    url() {
      return this.element.data.url;
    },
    height() {
      return this.element.data.height;
    },
    showPlaceholder() {
      return !this.element.data.url;
    }
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

.placeholder {
  margin: 0;
  padding: 119px;
  background-color: #f5f5f5;

  .message {
    .heading {
      font-size: 24px;
    }

    span {
      display: block;
      font-size: 18px;
    }
  }
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
    color: green;
    font-size: 22px;
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
