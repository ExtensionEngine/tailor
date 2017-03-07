<template>
  <div :class="columnWidth" class="asset-container">
    <div @click="focus" class="asset">
      <component
        :is="getComponentName(asset.type)"
        :asset="asset"
        :isFocused="isFocused"
        @save="save">
      </component>
    </div>
  </div>
</template>

<script>
import Gomo from './Gomo';
import ImageEditor from './Image';
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
import TextEditor from './Text';
import VideoEditor from './Video';

const ASSET_TYPES = {
  IMAGE: 'image-editor',
  TEXT: 'text-editor',
  VIDEO: 'video-editor',
  GOMO: 'gomo'
};

export default {
  name: 'asset',
  props: { asset: Object, disabled: Boolean },
  computed: {
    ...mapGetters(['toolbar'], 'atom'),
    columnWidth() {
      return `col-xs-${this.asset.layoutWidth}`;
    },
    isFocused() {
      let context = this.toolbar.context;
      return context && context._cid === this.asset._cid;
    }
  },
  methods: {
    ...mapMutations(['setToolbarContext'], 'atom'),
    ...mapActions({ updateAsset: 'update' }, 'assets'),
    getComponentName(type) {
      return ASSET_TYPES[type];
    },
    focus(e) {
      if (this.disabled) return;
      this.setToolbarContext({ type: this.asset.type, context: this.asset });
      // Attach component meta to event
      e.component = {
        name: 'asset',
        data: this.asset
      };
    },
    save(data) {
      if (this.asset.embed) {
        this.asset.data = data;
      } else {
        this.updateAsset({ ...this.asset, data });
      }
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
