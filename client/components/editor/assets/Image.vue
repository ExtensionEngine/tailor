<template>
  <div class="image-asset">
    <div v-if="showPlaceholder" class="well text-placeholder">
      <div class="message">
        <span class="heading">Image placeholder</span>
        <span>Click to edit</span>
      </div>
    </div>
    <div class="image-wrapper" v-else>
      <image-cropper
        v-show="isFocused"
        ref='cropper'
        drag-mode="crop"
        :view-mode="2"
        :auto-crop-area="0.5"
        :guides="true"
        :rotatable="true"
        :background="false"
        :zoomable="false"
        :scalable="false"
        :movable="false"
        :checkCrossOrigin="false"
        :alt="asset.name"
        :src="image">
      </image-cropper>
      <img v-show="!isFocused" :src="image" class="preview"/>
    </div>
  </div>
</template>

<script>
import ImageCropper from 'vue-cropperjs';
import { isEmpty } from 'lodash';
import toolbarActions from '../toolbar/toolbarActions';

export default {
  name: 'image-asset',
  props: ['asset', 'isFocused'],
  data() {
    return {
      original: '',
      image: ''
    };
  },
  computed: {
    localAsset() {
      return {
        // TODO(marko): Change to course id.
        url: this.image,
        courseKey: this.$route.params.courseKey
      };
    },
    showPlaceholder() {
      return isEmpty(this.asset.url);
    }
  },
  methods: {
    // Events received from toolbar
    crop() {
      this.image = this.$refs.cropper.getCroppedCanvas().toDataURL();
      this.$refs.cropper.replace(this.image);
    },
    clear() {
      this.$emit('save', { file: '' });
    },
    reset() {
      this.image = this.original;
      this.$refs.cropper.replace(this.original);
    },
    upload(url) {
      this.image = this.original = url;
      this.$emit('save', { url: this.image });
    },

    // Event generation methods
    generateEvents(method) {
      const events = ['clear', 'crop', 'reset', 'upload'];
      const namespaceEvent = name => `${name}/${this.asset._cid}`;
      events.forEach(e => {
        toolbarActions[method](namespaceEvent(e), this[e]);
      });
    },
    registerEvents() {
      this.generateEvents('$on');
    },
    cleanupEvents() {
      this.generateEvents('$off');
    }
  },
  created() {
    // TODO(marko): Loading images from remote URL into cropper.
    if (this.asset.url) this.image = this.original = this.asset.url;
    this.registerEvents();
  },
  destroyed() {
    this.cleanupEvents();
  },
  watch: {
    isFocused(val, oldVal) {
      if (oldVal && !val) this.$emit('save', this.localAsset);
    }
  },
  components: {
    ImageCropper
  }
};
</script>

<style lang="scss">
.image-asset {
  .text-placeholder.well {
    padding: 100px;
    margin-bottom: 0;

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

  .image-wrapper {
    max-width: 100%;

    .preview {
      max-height: 100%;
      max-width: 100%;
    }
  }

  .cropper-container {
    .cropper-wrap-box {
      background-color: #fff;
    }

    .cropper-modal {
      background-color: transparent;
      opacity: 0;
    }

    .cropper-canvas {
      img {
        display: block;
        height: 100px;
        width: 100px;
      }
    }
  }
}
</style>
