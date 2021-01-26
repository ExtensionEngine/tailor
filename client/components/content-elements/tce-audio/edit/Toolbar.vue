<template>
  <v-toolbar
    height="72"
    color="transparent"
    class="tce-audio-toolbar elevation-0">
    <v-toolbar-title class="pl-1">Audio Component</v-toolbar-title>
    <input-asset
      @input="save"
      :url="url"
      :public-url="publicUrl"
      :extensions="[
        '.mp3', '.mp4', '.aac', '.ogg', '.wma', '.flac', '.m4a', '.wav'
      ]"
      upload-label="Upload audio file"
      class="mx-auto" />
  </v-toolbar>
</template>

<script>
import get from 'lodash/get';
import InputAsset from '@/components/common/InputAsset';
import produce from 'immer';
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
    save({ url }) {
      const element = produce(this.element, draft => {
        set(draft.data, 'assets.url', url);
      });
      this.$emit('save', element);
    }
  },
  components: { InputAsset }
};
</script>

<style lang="scss" scoped>
.v-toolbar__title {
  min-width: 23.875rem;
  text-align: left;
}
</style>
