<template>
  <v-layout justify-center py-5 mt-4>
    <v-avatar size="120px">
      <div class="img-container">
        <img v-if="image" :src="image">
        <v-icon v-else size="106px" color="grey">mdi-account</v-icon>
        <v-icon @click="dialog = true" dark class="overlay">mdi-camera</v-icon>
      </div>
    </v-avatar>
    <avatar-dialog :visible.sync="dialog" :imgUrl.sync="image"/>
  </v-layout>
</template>

<script>
import AvatarDialog from './Dialog';

export default {
  name: 'user-avatar',
  props: {
    imgUrl: { type: String, default: null }
  },
  data() {
    return {
      image: null,
      dialog: false
    };
  },
  watch: {
    image(value) {
      this.$emit('update:imgUrl', value);
    },
    imgUrl: {
      immediate: true,
      handler(imgUrl) {
        this.image = imgUrl;
      }
    }
  },
  components: { AvatarDialog }
};
</script>

<style lang="scss" scoped>
$image-border: 4px solid #e3e3e3;
$image-bg-color: #f5f5f5;
$image-width: 120px;
$image-height: 120px;

.v-avatar {
  .img-container {
    position: relative;
    height: $image-height;
  }

  img, .v-icon {
    background-color: $image-bg-color;
    border: $image-border;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: $image-width;
    background: #607d8b;
    opacity: 0.7;
    cursor: pointer;
  }

  &:not(:hover) .overlay { display: none; }
}
</style>
