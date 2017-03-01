<template>
  <div class="image-asset">
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
        :autoCropUpdate="true"
        :guides="true"
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
import concat from 'lodash/concat';
import Cropper from '../../common/Cropper';
import eventBus from '../toolbar/toolbarActions';
import { imgSrcToDataURL } from 'blob-util';
import isEmpty from 'lodash/isEmpty';

export default {
  props: ['asset', 'isFocused'],
  data() {
    return {
      persistedImage: null,
      currentImage: null
    };
  },
  computed: {
    showPlaceholder() {
      return isEmpty(this.asset.data.url);
    }
  },
  methods: {
    upload(dataUrl) {
      this.currentImage = dataUrl;
      this.persistedImage = dataUrl;
      this.$emit('save', { url: dataUrl });
    },
    crop() {
      this.currentImage = this.$refs.cropper.getCroppedCanvas().toDataURL();
      this.$refs.cropper.replace(this.currentImage);
    },
    showCrop() {
      if (this.currentImage) this.$refs.cropper.show();
    },
    hideCrop() {
      this.$refs.cropper.clear();
    },
    clear() {
      this.persistedImage = null;
      this.currentImage = null;
      this.$emit('save', { url: null });
    },
    reset() {
      this.currentImage = this.persistedImage;
      this.$refs.cropper.replace(this.persistedImage);
    },
    generateEvents(method) {
      const actions = ['clear', 'crop', 'reset', 'upload'];
      const tools = ['showCrop', 'hideCrop'];
      const events = concat(actions, tools);
      const namespace = name => `${name}/${this.asset._cid}`;
      events.forEach(it => eventBus[method](namespace(it), this[it]));
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
  mounted() {
    const imageUrl = this.asset.data.url;
    if (!imageUrl) return;
    imgSrcToDataURL(imageUrl, 'image/png', 'Anonymous').then(dataUrl => {
      this.currentImage = dataUrl;
      this.persistedImage = dataUrl;
      this.$refs.cropper.replace(this.currentImage);
      setTimeout(this.hideCrop, 0);
    });
  },
  destroyed() {
    this.cleanupEvents();
  },
  watch: {
    isFocused(val, oldVal) {
      if (oldVal && !val && (this.persistedImage !== this.currentImage)) {
        this.$emit('save', { url: this.currentImage });
      }
    }
  },
  components: {
    Cropper
  }
};
</script>

<style lang="scss" scoped>
.image-placeholder {
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
</style>
