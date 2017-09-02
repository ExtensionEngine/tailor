<template>
  <div :style="{ height: height + 'px' }" class="te-embed">
    <div v-if="showPlaceholder">
      <div :style="{ height: height + 'px' }" class="well placeholder">
        <span class="heading">Embed placeholder</span>
        <span class="message" v-show="!isFocused">Select to edit</span>
        <span class="message" v-show="isFocused">Please use toolbar to enter url</span>
      </div>
    </div>
    <div v-else>
      <div class="content">
        <div class="overlay" v-show="!isFocused">
          <div class="message">Click to preview</div>
        </div>
        <!-- Dragging iframes is not supported inside sortablejs container! -->
        <iframe
          v-if="!isDragged"
          :src="url"
          class="content"
          ref="frame"
          frameborder="0"
          sandbox="allow-forms allow-same-origin allow-scripts">
        </iframe>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'te-embed',
  props: ['element', 'isFocused', 'isDragged'],
  computed: {
    height() {
      return this.element.data.height;
    },
    url() {
      return this.element.data.url;
    },
    showPlaceholder() {
      return !this.element.data.url;
    }
  },
  created() {
    if (this.element.height) return;
    this.$emit('save', { height: 500 });
  }
};
</script>

<style lang="scss" scoped>
.te-embed {
  position: relative;
  overflow: auto;
}

.placeholder {
  margin: 0;
  padding: 119px;

  .heading {
    font-size: 24px;
  }

  .message {
    display: block;
    font-size: 18px;
  }
}

.overlay {
  position: absolute;
  z-index: 99;
  width: 100%;
  height: 100%;
  background-color: #333;
  opacity: 0.9;

  .message {
    padding-top: 119px;
    color: green;
    font-size: 22px;
  }
}

.content {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
