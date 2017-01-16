<template>
  <div :class="columnWidth" class="asset-container">
    <div @click="focus" class="asset">
      <text-editor
        v-if="asset.type === 'text'"
        :asset="asset"
        :isFocused="isFocused"
        @save="save">
      </text-editor>
      <video-editor
        v-if="asset.type === 'video'"
        :asset="asset"
        :isFocused="isFocused">
      </video-editor>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex-module';
import TextEditor from './Text';
import VideoEditor from './Video';

export default {
  name: 'asset',
  props: { asset: Object },
  computed: {
    ...mapGetters(['focusedAsset'], 'atom'),
    columnWidth() {
      return `col-xs-${this.asset.width}`;
    },
    isFocused() {
      return this.focusedAsset && (this.focusedAsset._cid === this.asset._cid);
    }
  },
  methods: {
    ...mapActions({ saveAsset: 'save' }, 'assets'),
    ...mapMutations(['focusAsset'], 'atom'),
    focus(e) {
      this.focusAsset(this.asset);
      // Attach component meta to event
      e.component = {
        name: 'asset',
        data: this.asset
      };
    },
    save(asset) {
      this.saveAsset({ ...this.asset, ...asset });
    }
  },
  components: {
    TextEditor,
    VideoEditor
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
