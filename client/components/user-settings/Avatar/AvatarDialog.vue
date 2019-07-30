<template>
  <v-dialog v-model="show" width="640">
    <v-card>
      <v-card-title class="elevation-2 primary">
        <v-icon>mdi-lock-open</v-icon>
        <h4>Change Avatar</h4>
        <v-spacer />
        <v-icon @click="close">mdi-close-circle-outline</v-icon>
      </v-card-title>
      <v-card-text>
        <croppa
          v-model="croppa"
          v-bind="options"
          :initial-image="imgUrl"
          prevent-white-space />
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn v-if="croppa.imageSet" @click="croppa.remove()" flat>Remove</v-btn>
        <v-btn @click="croppa.chooseFile()" flat>Upload</v-btn>
        <v-btn @click="confirm" color="primary">Update</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { avatar as avatarOpts } from 'shared';

export default {
  name: 'avatar-dialog',
  props: {
    visible: { type: Boolean, default: false },
    imgUrl: { type: String, default: null }
  },
  data() {
    return {
      croppa: {},
      image: null
    };
  },
  computed: {
    options: vm => ({
      accept: 'image/*',
      width: 220,
      height: 220
    }),
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) this.close();
      }
    }
  },
  methods: {
    close() {
      this.$emit('update:visible', false);
    },
    confirm() {
      const { mimetype, compressionRate } = avatarOpts;
      const imgUrl = this.croppa.generateDataUrl(mimetype, compressionRate);
      this.$emit('update', imgUrl);
      this.close();
    }
  }
};
</script>

<style lang="scss" scoped>
$image-border: 8px solid #e3e3e3;
$image-bg-color: #f5f5f5;
$image-width: 240px;
$image-height: 240px;

.v-card__title {
  height: 55px;
  color: #fff;

  .v-icon {
    margin-right: 8px;
    color: inherit;
  }

  h4 {
    margin: 0 8px;
    font-weight: 300;
  }
}

.v-dialog__content {
  align-items: flex-start;
  margin-top: 150px;
}

.croppa-container {
  overflow: hidden;
  border-radius: 50%;
  width: $image-width;
  height: $image-height;
  margin: 25px auto;
  background-color: $image-bg-color;
  border: $image-border;
  cursor: pointer;

  &.croppa--has-target {
    /deep/ {
      canvas {
        width: 100% !important;
        height: 224px !important;
      }
    }

    &:active { cursor: grab; }
    &.croppa--disabled { cursor: auto; }
  }
}

.slider {
  max-width: 240px;
  margin: 0 auto;
}
</style>
