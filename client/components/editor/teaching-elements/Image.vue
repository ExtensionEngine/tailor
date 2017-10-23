<template>
  <div class="te-image">
    <div v-if="showPlaceholder" class="well image-placeholder">
      <div class="message">
        <span class="heading">Image placeholder</span>
        <span>Click to edit</span>
      </div>
    </div>
    <div v-else class="image-wrapper">
      <cropper
        ref="cropper"
        drag-mode="none"
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
        :src="currentImage">
      </cropper>
    </div>
  </div>
</template>

<script>
import Cropper from '../../common/Cropper';
import EventBus from 'EventBus';
import { imgSrcToDataURL } from 'blob-util';
import isEmpty from 'lodash/isEmpty';

const teChannel = EventBus.channel('te');

export default {
  name: 'te-image',
  props: ['element', 'isFocused'],
  data() {
    return {
      currentImage: null,
      persistedImage: null,
      showCropper: false
    };
  },
  methods: {
    ready() {
      if (!this.showCropper || !this.$refs.cropper) return;
      this.$refs.cropper.show();
    }
  },
  computed: {
    showPlaceholder() {
      return isEmpty(this.element.data.url);
    },
    id() {
      return this.element._cid || this.element.id;
    }
  },
  mounted() {
    const imageUrl = this.element.data.url;
    if (imageUrl) {
      imgSrcToDataURL(imageUrl, 'image/png', 'Anonymous').then(dataUrl => {
        this.currentImage = dataUrl;
        this.persistedImage = dataUrl;
        this.$refs.cropper.replace(this.currentImage);
      });
    }

    teChannel.on(`${this.id}/upload`, dataUrl => {
      if (this.currentImage) this.$refs.cropper.replace(dataUrl);
      this.currentImage = dataUrl;
      this.persistedImage = dataUrl;
      this.$emit('save', { url: dataUrl });
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
  watch: {
    isFocused(focused) {
      if (focused) return;

      if (this.persistedImage !== this.currentImage) {
        this.$emit('save', { url: this.currentImage });
      }

      if (this.currentImage) this.$refs.cropper.clear();
    }
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
</style>
