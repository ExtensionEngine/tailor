<template>
  <div class="gomo-viewer">
    <div v-if="showPlaceholder">
      <div class="well placeholder">
        <span class="heading">Gomo Viewer placeholder</span>
        <span class="message" v-show="!isFocused">Select to edit</span>
        <span class="message" v-show="isFocused">Please use toolbar to enter url</span>
      </div>
    </div>
    <div v-else>
      <div class="content">
        <div class="overlay" v-show="!isFocused">
          <div class="message">Click to preview</div>
        </div>
        <iframe
          ref="frame"
          :src="courseUrl"
          class="content"
          frameborder="0">
        </iframe>
      </div>
      <div class="pusher"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'gomo-course',
  props: ['asset', 'isFocused'],
  computed: {
    courseUrl() {
      return this.asset.data.courseUrl;
    },
    showPlaceholder() {
      return !this.asset.data.courseUrl;
    }
  }
};
</script>

<style lang="scss" scoped>
.gomo-viewer {
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
    position: relative;
    top: 45%;
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

.pusher {
  margin-top: 56.25%;
}
</style>
