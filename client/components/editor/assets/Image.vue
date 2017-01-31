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
        :background="true"
        :zoomable="false"
        :scalable="true"
        :movable="false"
        :alt="asset.name"
        :src="image">
      </image-cropper>
      <img v-show="!isFocused" :src="image" class="img-responsive" />
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
      originalImage: '',
      image: ''
    };
  },
  computed: {
    localAsset() {
      return {
        file: this.image,
        courseKey: this.$route.params.courseKey
      };
    },
    showPlaceholder() {
      return isEmpty(this.asset.file);
    }
  },
  methods: {
    // Events received from toolbar
    crop() {
      this.image = this.$refs.cropper.getCroppedCanvas().toDataURL();
      this.$refs.cropper.replace(this.image);
    },
    reset() {
      this.image = this.originalImage;
      this.$refs.cropper.replace(this.originalImage);
    },
    upload({ file, name }) {
      this.image = this.originalImage = file;
      this.$emit('save', { file, name });
    },
    rotateLeft() {
      this.$refs.cropper.rotate(-90);
      this.image = this.$refs.cropper.getCroppedCanvas().toDataURL();
    },
    rotateRight() {
      this.$refs.cropper.rotate(90);
      this.image = this.$refs.cropper.getCroppedCanvas().toDataURL();
    },

    // Event generation methods
    generateEvents(method) {
      const events = ['crop', 'reset', 'upload', 'rotateLeft', 'rotateRight'];
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
.text-placeholder {
  .message {
    padding: 9px;

    .heading {
      font-size: 24px;
    }

    span {
      display: block;
      font-size: 18px;
    }
  }
}

.text-placeholder.well {
  padding: 100px;
  margin-bottom: 0;
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
</style>
