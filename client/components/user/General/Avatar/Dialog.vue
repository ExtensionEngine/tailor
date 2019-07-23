<template>
  <v-dialog v-model="show" width="500">
    <v-card>
      <v-card-text>
        <croppa
          v-model="croppa"
          v-bind="options"
          :initial-image="image"
          @new-image-drawn="onNewImage"
          @zoom="onZoom"
          @dblclick="onZoom"
          prevent-white-space/>
        <v-slider
          v-model="sliderVal"
          v-bind="sliderRange"
          :hide-details="true"
          :step="0.01"
          @input="onSliderChange"
          @click:append="croppa.zoomIn()"
          @click:prepend="croppa.zoomOut()"
          always-dirty
          append-icon="mdi-plus"
          prepend-icon="mdi-minus"
          color="light-blue darken-3"
          class="slider"/>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="chooseFile" flat>Upload</v-btn>
        <v-btn @click="confirm" color="error" flat>Confirm</v-btn>
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
      croppa: null,
      image: null,
      sliderVal: 0,
      sliderRange: { min: 0, max: 0 }
    };
  },
  computed: {
    options: vm => ({
      accept: 'image/*',
      width: 240,
      height: 240
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
    chooseFile() {
      this.croppa.chooseFile();
    },
    close() {
      this.$emit('update:visible', false);
    },
    confirm() {
      const { mimetype, compressionRate } = avatarOpts;
      const imgUrl = this.croppa.generateDataUrl(mimetype, compressionRate);
      this.$emit('update:imgUrl', imgUrl);
      this.close();
    },
    onSliderChange(val) {
      if (!val) return;
      this.croppa.scaleRatio = val;
    },
    onNewImage() {
      const { scaleRatio } = this.croppa;
      Object.assign(this.sliderRange, {
        min: scaleRatio,
        max: scaleRatio * 2
      });
      this.sliderVal = this.sliderRange.min;
    },
    onZoom(e) {
      if (!e) return (this.sliderVal = this.croppa.scaleRatio);
      this.croppa.scaleRatio *= 1.2;
      this.sliderVal = this.croppa.scaleRatio;
    }
  },
  watch: {
    imgUrl: {
      immediate: true,
      handler(imgUrl) {
        this.image = imgUrl;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
$image-border: 8px solid #e3e3e3;
$image-bg-color: #f5f5f5;
$image-width: 240px;
$image-height: 240px;

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
