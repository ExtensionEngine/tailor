<template>
  <div class="select-asset">
    <div
      v-for="asset in filteredAssets"
      @click="$emit('selected', asset.type)"
      class="content-type">
      <span class="fa" :class="asset.icon"></span>
      <span>{{ asset.label }}</span>
    </div>
  </div>
</template>

<script>
import filter from 'lodash/filter';

export default {
  name: 'select-asset',
  props: ['include'],
  data() {
    return {
      assets: [
        { type: 'VIDEO', label: 'Video', icon: 'fa-video-camera' },
        { type: 'TEXT', label: 'Text', icon: 'fa-file-text-o' },
        { type: 'IMAGE', label: 'Image', icon: 'fa-image' },
        { type: 'GOMO', label: 'Gomo', icon: 'fa-window-maximize' }
      ]
    };
  },
  computed: {
    filteredAssets() {
      if (!this.include) return this.assets;
      return filter(this.assets, it => this.include.indexOf(it.type) > -1);
    }
  }
};
</script>

<style lang="scss">
.select-asset {
  display: inline-block;
}

.content-type {
  display: inline-block;
  padding: 5px 10px;
  margin: 0 20px;

  &:hover {
    color: #42b983;
    cursor: pointer;
  }

  span {
    display: block;
    font-size: 16px;
  }

  .fa {
    padding-bottom: 7px;
    font-size: 26px;
  }
}
</style>
