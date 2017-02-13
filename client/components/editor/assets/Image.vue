<template>
  <div class="image-asset">
    <div v-if="showPlaceholder" class="well text-placeholder">
      <div class="message">
        <span class="heading">Image placeholder</span>
        <span>Click to edit</span>
      </div>
    </div>
    <div v-else class="image-wrapper">
      <cropper
        ref='cropper'
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
        :style="{ 'width': '100%' }"
        :src="image">
      </cropper>
    </div>
  </div>
</template>

<script>
import { concat, isEmpty } from 'lodash';
import { imgSrcToDataURL } from 'blob-util';
import Cropper from '../../common/Cropper';
import toolbarActions from '../toolbar/toolbarActions';

export default {
  name: 'image-asset',
  props: ['asset', 'isFocused'],
  data() {
    return {
      original: null,
      image: null
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
      this.image = this.original = null;
      this.$emit('save', { url: null });
    },
    reset() {
      this.image = this.original;
      this.$refs.cropper.replace(this.original);
    },
    upload(url) {
      this.image = this.original = url;
      this.$emit('save', { url: this.image });
    },
    showCrop() {
      this.$refs.cropper.show();
    },
    hideCrop() {
      this.$refs.cropper.clear();
    },

    // Event generation methods
    generateEvents(method) {
      const events = ['clear', 'crop', 'reset', 'upload'];
      const tools = ['showCrop', 'hideCrop'];
      const names = concat(events, tools);
      const namespaceEvent = name => `${name}/${this.asset._cid}`;
      names.forEach(n => {
        toolbarActions[method](namespaceEvent(n), this[n]);
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
  mounted() {
    if (this.asset.data.url) {
      imgSrcToDataURL(this.asset.data.url, 'image/png', 'Anonymous')
        .then(dataUrl => {
          this.image = this.original = dataUrl;
          this.$refs.cropper.replace(this.image);
        })
        .then(() => setTimeout(this.hideCrop, 50));
    }
  },
  destroyed() {
    this.cleanupEvents();
  },
  watch: {
    isFocused(val, oldVal) {
      if (oldVal && !val) {
        if (this.image) this.hideCrop();
        this.$emit('save', this.localAsset);
      }
    }
  },
  components: {
    Cropper
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
