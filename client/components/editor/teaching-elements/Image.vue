<template>
  <div class="te-image">
    <div v-if="showPlaceholder" class="well image-placeholder">
      <div class="message">
        <span class="heading">Image placeholder</span>
        <span>Click to edit</span>
      </div>
    </div>
    <div v-else :class="{ 'hide-cropper': !showCropper }" class="image-wrapper">
      <cropper
        v-show="showCropper"
        ref="cropper"
        :view-mode="2"
        :auto-crop-area="0.5"
        :autoCrop="false"
        :guides="true"
        :ready="ready"
        :responsive="true"
        :rotatable="false"
        :background="false"
        :zoomable="false"
        :scalable="false"
        :movable="false"
        :modal="false"
        :src="currentImage"
        drag-mode="none">
      </cropper>
      <img v-show="!showCropper" :src="currentImage" class="preview-image">
    </div>
  </div>
</template>

<script>
import Cropper from '../../common/Cropper';
import EventBus from 'EventBus';
import { imgSrcToDataURL } from 'blob-util';
import isEmpty from 'lodash/isEmpty';

const teChannel = EventBus.channel('te');

function toDataUrl(imageUrl) {
  if (!imageUrl) return Promise.resolve(imageUrl);
  return imgSrcToDataURL(imageUrl, 'image/png', 'Anonymous');
}

function getImageDimensions(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = (event) => reject(event);
    img.src = url;
  });
}

export default {
  name: 'te-image',
  props: {
    element: { type: Object, required: true },
    isFocused: { type: Boolean, default: false }
  },
  data() {
    return {
      currentImage: null,
      persistedImage: null,
      showCropper: false
    };
  },
  computed: {
    showPlaceholder() {
      const imageAvailable = !isEmpty(this.element.data.url);
      if (imageAvailable) return false;
      if (this.$refs.cropper) this.$refs.cropper.destroy();
      return true;
    },
    id() {
      return this.element._cid || this.element.id;
    }
  },
  methods: {
    ready() {
      if (!this.showCropper || !this.$refs.cropper) return;
      this.$refs.cropper.show();
    },
    load(dataUrl) {
      this.currentImage = dataUrl;
      this.persistedImage = dataUrl;
      if (dataUrl) this.$refs.cropper.replace(dataUrl);
    },
    save(image) {
      getImageDimensions(image).then(({ width, height }) => {
        this.$emit('save', { url: image, meta: { width, height } });
      });
    }
  },
  watch: {
    isFocused(focused) {
      if (focused) return;

      if (this.persistedImage !== this.currentImage) {
        this.save(this.currentImage);
      }

      if (this.currentImage) this.$refs.cropper.clear();
    },
    'element.data.url'(imageUrl) {
      toDataUrl(imageUrl).then(dataUrl => this.load(dataUrl));
    }
  },
  mounted() {
    toDataUrl(this.element.data.url).then(dataUrl => this.load(dataUrl));

    teChannel.on(`${this.id}/upload`, dataUrl => {
      if (this.currentImage) this.$refs.cropper.replace(dataUrl);
      this.currentImage = dataUrl;
      this.persistedImage = dataUrl;
      this.save(dataUrl);
    });

    teChannel.on(`${this.id}/showCropper`, () => {
      this.showCropper = true;
      this.$refs.cropper.show();
    });

    teChannel.on(`${this.id}/hideCropper`, () => {
      this.showCropper = false;
      this.$refs.cropper.clear();
    });

    teChannel.on(`${this.id}/crop`, () => {
      this.currentImage = this.$refs.cropper.getCroppedCanvas().toDataURL();
      this.$refs.cropper.replace(this.currentImage);
    });

    teChannel.on(`${this.id}/undo`, () => {
      this.currentImage = this.persistedImage;
      this.$refs.cropper.replace(this.persistedImage);
    });
  },
  beforeDestroy() {
    if (this.$refs.cropper) this.$refs.cropper.destroy();
  },
  components: {
    Cropper
  }
};
</script>

<style lang="scss" scoped>
.image-placeholder {
  margin-bottom: 0;
  padding: 100px;

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

.hide-cropper /deep/ .cropper-container {
  display: none;
}

img {
  max-width: 100%;
}
</style>
