<template>
  <div :class="columnWidth" class="asset-container">
    <div @click="focus" class="asset">
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
import TextEditor from './Text';
import VideoEditor from './Video';
import Gomo from './Gomo';

export default {
  name: 'asset',
  props: { asset: Object },
  computed: {
    ...mapGetters(['toolbar']),
    columnWidth() {
      return `col-xs-${this.asset.layoutWidth}`;
    },
    isFocused() {
      return this.toolbar.context._cid === this.asset._cid;
    }
  },
  methods: {
    ...mapActions({ updateAsset: 'update' }, 'assets'),
    ...mapMutations(['setToolbar']),
    focus(e) {
      this.setToolbar(this.asset);
      // Attach component meta to event
      e.component = {
        name: 'asset',
        data: this.asset
      };
    },
    save(data) {
      this.updateAsset({ ...this.asset, data });
    }
  },
  components: {
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
