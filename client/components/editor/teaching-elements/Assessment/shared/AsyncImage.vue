<template>
  <div class="dead-center-img-container">
    <img :src="imgSrc" class="dead-center-img"/>
  </div>
</template>

<script>
import { imgSrcToDataURL } from 'blob-util';

const PLACEHOLDER_URL = './assets/img/no-image.png';

export default {
  props: {
    url: { type: String, required: true }
  },
  data() {
    return {
      imgSrc: PLACEHOLDER_URL
    };
  },
  watch: {
    url: {
      immediate: true,
      handler: function (url) {
        if (!url) return;
        // TODO: support other image types
        return imgSrcToDataURL(url, 'image/png', 'Anonymous')
          .then(dataUrl => (this.imgSrc = dataUrl || PLACEHOLDER_URL));
      }
    }
  }
};
</script>

<style lang="scss" scoped>
$deadCenterImageDimension: 128px;

.dead-center-img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  max-width: 100%;
  max-height: 100%;

  &-container {
    position: relative;
    width: $deadCenterImageDimension;
    height: $deadCenterImageDimension;
    vertical-align: middle;
    border: 1px solid #ccc;
  }
}
</style>
