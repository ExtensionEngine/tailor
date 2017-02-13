<template>
  <div :class="columnWidth" class="asset-container">
    <div @click="focus" class="asset">
      <image-editor
        v-if="asset.type === 'IMAGE'"
        :asset="asset"
        :isFocused="isFocused"
        :showLoader="showLoader"
        @save="save">
      </image-editor>
      <text-editor
        v-if="asset.type === 'TEXT'"
        :asset="asset"
        :isFocused="isFocused"
        @save="save">
      </text-editor>
      <video-editor
        v-if="asset.type === 'VIDEO'"
        :asset="asset"
        :isFocused="isFocused">
      </video-editor>
      <gomo
        v-if="asset.type === 'GOMO'"
        :asset="asset"
        :isFocused="isFocused">
      </gomo>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex-module';
import Promise from 'bluebird';
import ImageEditor from './Image';
import TextEditor from './Text';
import VideoEditor from './Video';
import Gomo from './Gomo';

export default {
  name: 'asset',
  props: { asset: Object },
  data() {
    return {
      showLoader: false
    };
  },
  computed: {
    ...mapGetters(['focusedAsset'], 'atom'),
    columnWidth() {
      return `col-xs-${this.asset.layoutWidth}`;
    },
    isFocused() {
      return this.focusedAsset && (this.focusedAsset._cid === this.asset._cid);
    }
  },
  methods: {
    ...mapActions({ updateAsset: 'update' }, 'assets'),
    ...mapMutations(['focusAsset'], 'atom'),
    focus(e) {
      this.focusAsset(this.asset);
      // Attach component meta to event
      e.component = {
        name: 'asset',
        data: this.asset
      };
    },
    save(data) {
      this.showLoader = true;
      Promise.join(Promise.delay(300), this.updateAsset({ ...this.asset, data }))
        .then(() => {
          this.showLoader = false;
        });
    }
  },
  components: {
    ImageEditor,
    TextEditor,
    VideoEditor,
    Gomo
  }
};
</script>

<style lang="scss" scoped>
.asset-container {
  padding: 7px 0;
}

.asset {
  padding: 10px;
  border: 1px dashed #ccc;
}
</style>
