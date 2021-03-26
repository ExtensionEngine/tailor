<template>
  <v-toolbar
    height="72"
    color="transparent"
    class="tce-video-toolbar elevation-0">
    <v-toolbar-title class="pl-1">Video component</v-toolbar-title>
    <input-asset
      @input="save"
      :folder="`repository/${element.repositoryId}`"
      :url="url"
      :public-url="publicUrl"
      :extensions="['.mp4']"
      upload-label="Upload mp4"
      class="mx-auto" />
  </v-toolbar>
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
    publicUrl: vm => get(vm.element, 'data.url'),
    url: vm => get(vm.element, 'data.assets.url')
  },
  methods: {
    save({ url }) {
      const element = cloneDeep(this.element);
      set(element.data, 'assets.url', url);
      this.$elementBus.emit('save', element);
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
