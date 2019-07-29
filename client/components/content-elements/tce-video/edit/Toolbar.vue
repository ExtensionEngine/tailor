<template>
  <div class="tce-video-toolbar">
    <input-asset
      @input="save"
      :url="url"
      :public-url="publicUrl"
      :extensions="['.mp4']"
      upload-label="Upload mp4" />
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import InputAsset from '@/components/common/InputAsset';
import set from 'lodash/set';

export default {
  name: 'tce-video-toolbar',
  inject: ['$elementBus'],
  props: {
    element: { type: Object, required: true }
  },
  computed: {
    publicUrl() {
      return get(this.element, 'data.url');
    },
    url() {
      return get(this.element, 'data.assets.url');
    }
  },
  methods: {
    save({ url, publicUrl }) {
      const element = cloneDeep(this.element);
      set(element.data, 'assets.url', url);
      this.$elementBus.emit('save', element);
    }
  },
  components: { InputAsset }
};
</script>

<style lang="scss" scoped>
.tce-video-toolbar {
  position: relative;
  width: 100%;
  height: 60px;
  padding: 13px 45px 0;
}
</style>
