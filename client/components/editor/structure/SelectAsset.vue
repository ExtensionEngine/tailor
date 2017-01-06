<template>
  <div>
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
        { type: 'video', label: 'Video', icon: 'fa-video-camera' },
        { type: 'text', label: 'Text', icon: 'fa-file-text-o' },
        { type: 'image', label: 'Image', icon: 'fa-image' }
      ]
    };
  }
};
</script>
