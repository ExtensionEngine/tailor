<template>
  <div class="select-asset">
    <div
      v-for="asset in assets"
      @click="$emit('selected', asset.type)"
      class="content-type">
      <span class="fa" :class="asset.icon"></span>
      <span>{{ asset.label }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'select-asset',
  data() {
    return {
      assets: [
        { type: 'VIDEO', label: 'Video', icon: 'fa-video-camera' },
        { type: 'TEXT', label: 'Text', icon: 'fa-file-text-o' },
        { type: 'IMAGE', label: 'Image', icon: 'fa-image' }
      ]
    };
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
