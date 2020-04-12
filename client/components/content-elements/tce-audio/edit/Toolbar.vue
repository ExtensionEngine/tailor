<template>
  <v-toolbar
    height="72"
    color="transparent"
    class="tce-audio-toolbar elevation-0">
    <v-toolbar-title>Audio Component</v-toolbar-title>
    <input-asset
      @input="save"
      :url="url"
      :public-url="publicUrl"
      :extensions="[
        '.mp3', '.mp4', '.aac', '.ogg', '.wma', '.flac', '.alac', '.m4a', '.wav'
      ]"
      upload-label="Upload audio file"
      class="mx-auto" />
  </v-toolbar>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import InputAsset from '@/components/common/InputAsset';
import set from 'lodash/set';

export default {
  name: 'tce-audio-toolbar',
  inject: ['$elementBus'],
  props: {
    element: { type: Object, required: true }
  },
  computed: {
    publicUrl: vm => get(vm.element, 'data.url'),
    url: vm => get(vm.element, 'data.assets.url')
  },
  methods: {
    save({ url, publicUrl }) {
      const element = cloneDeep(this.element);
      set(element.data, 'assets.url', url);
      this.$emit('save', element);
    }
  },
  components: { InputAsset }
};
</script>

<style lang="scss" scoped>
.tce-audio-toolbar {
  position: relative;
  width: 100%;
}

.v-toolbar__title {
  min-width: 23.875rem;
  text-align: left;
}
</style>
