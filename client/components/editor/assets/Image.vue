<template>
  <div class="image-asset">
    <div v-if="showPlaceholder" class="well text-placeholder">
      <div class="message">
        <span class="heading">Image placeholder</span>
        <span>Click to edit</span>
      </div>
    </div>
    <div v-else class="image-wrapper">
      <image-cropper
        ref='cropper'
        drag-mode="crop"
        :view-mode="2"
        :auto-crop-area="0.5"
        :guides="true"
        :responsive="true"
        :rotatable="false"
        :background="false"
        :zoomable="false"
        :scalable="false"
        :movable="false"
        :modal="false"
        :style="{ 'width': '100%' }"
        :src="image">
      </image-cropper>
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
        url: this.image
      };
    },
    showPlaceholder() {
      return isEmpty(this.asset.data.url);
    }
  },
  methods: {
    // Events received from toolbar
    crop() {
      this.image = this.$refs.cropper.getCroppedCanvas().toDataURL();
      this.$refs.cropper.replace(this.image);
    },
    clear() {
      this.$emit('save', { url: '' });
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
    },

    // Helpers
    toggleCropBox() {
      const cropBox = this.$el.querySelector('.cropper-crop-box');

      if (this.image) {
        if (this.isFocused) cropBox.style.display = 'block';
        else cropBox.style.display = 'none';
      }
    }
  },
  created() {
    if (this.asset.data.url) this.image = this.original = this.asset.data.url;
    this.registerEvents();
  },
  destroyed() {
    this.cleanupEvents();
  },
  watch: {
    isFocused(val, oldVal) {
      if (oldVal && !val) this.$emit('save', this.localAsset);
      this.$nextTick(() => this.toggleCropBox());
    },
    original(val, oldVal) {
      // Wait before querying child component elements
      setTimeout(() => {
        this.$nextTick(() => this.toggleCropBox());
      }, 150);
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

    .image-wrapper {
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
  }
}
</style>
