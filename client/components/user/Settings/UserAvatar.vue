<template>
  <v-layout class="user-avatar-container">
    <div v-if="!disabled" v-show="isEditing" class="croppa-box">
      <croppa
        v-model="croppa"
        v-bind="options"
        @new-image-drawn="onNewImage"
        @file-choose="uploadImage"
        @zoom="onZoom"
        @dblclick="onZoom"
        placeholder
        prevent-white-space
        show-loading>
      </croppa>
      <v-layout v-if="isEditing" class="slider-layout">
        <v-slider
          v-model="sliderVal"
          v-bind="sliderRange"
          :hide-details="true"
          :step="0.001"
          @input="onSliderChange"
          @click:append="croppa.zoomIn()"
          @click:prepend="croppa.zoomOut()"
          always-dirty
          append-icon="mdi-plus"
          prepend-icon="mdi-minus"
          color="light-blue darken-3"
          class="slider">
        </v-slider>
      </v-layout>
    </div>
    <v-avatar v-if="!isEditing" :size="options.height">
      <img v-if="currentImage" :src="user.imgUrl">
      <v-icon v-else class="placeholder-icon" color="grey">mdi-account</v-icon>
      <div @click="uploadNewImage" class="v-avatar actions">
        <v-icon dark>mdi-camera</v-icon>
      </div>
    </v-avatar>
    <v-divider/>
  </v-layout>
</template>

<script>
import { mapActions, mapGetters } from 'vuex-module';
import { avatar as avatarOpts } from 'shared';

const snackOpts = { right: true };

export default {
  name: 'user-avatar',
  props: {
    isEditing: { type: Boolean, default: false }
  },
  data: () => ({
    disabled: false,
    currentImage: null,
    timeout: 2500,
    sliderVal: 0,
    sliderRange: { min: 0, max: 0 },
    croppa: {}
  }),
  computed: {
    ...mapGetters(['user']),
    options: vm => ({
      accept: 'image/*',
      width: 120,
      height: 120,
      disabled: vm.disabled,
      showRemoveButton: false
    })
  },
  methods: {
    ...mapActions(['updateInfo']),
    uploadImage(file) {
      this.$emit('editing', Boolean(file));
    },
    uploadNewImage() {
      this.disabled = false;
      this.$nextTick(() => this.croppa.chooseFile());
    },
    doneEditing() {
      if (this.disabled || !this.isEditing) return;
      const { mimetype, compressionRate } = avatarOpts;
      const imgUrl = this.croppa.generateDataUrl(mimetype, compressionRate);
      this.updateInfo({ imgUrl })
        .then(() => {
          this.currentImage = this.user.imgUrl;
          this.$snackbar.success('Profile photo updated.', snackOpts);
        })
        .catch(() => this.$snackbar.error('An error has occurred!', snackOpts))
        .finally(() => {
          this.$emit('editing', false);
          this.disabled = true;
        });
    },
    onNewImage() {
      const { scaleRatio } = this.croppa;
      Object.assign(this.sliderRange, {
        min: scaleRatio,
        max: scaleRatio * 2
      });
      this.sliderVal = this.sliderRange.min;
    },
    onSliderChange(val) {
      if (!val) return;
      this.croppa.scaleRatio = val;
    },
    onZoom(e) {
      if (!e) return (this.sliderVal = this.croppa.scaleRatio);
      this.croppa.scaleRatio *= 1.2;
      this.sliderVal = this.croppa.scaleRatio;
    }
  },
  watch: {
    isEditing(newValue) {
      if (!newValue) this.disabled = true;
    }
  },
  created() {
    this.disabled = true;
    this.currentImage = this.user.imgUrl;
  }
};
</script>

<style lang="scss" scoped>
$image-border: 4px solid #e3e3e3;
$image-bg-color: #f5f5f5;
$image-width: 120px;
$image-height: 120px;

@mixin flex-container($justify-content: center) {
  display: flex;
  justify-content: $justify-content;
}

.user-avatar-container {
  flex-flow: column wrap;
  margin-top: 18px;
  @include flex-container();
}

.v-avatar {
  position: relative;
  margin: 0 auto;

  img {
    width: 100%;
    background-color: $image-bg-color;
    border: $image-border;
  }

  .placeholder-icon {
    font-size: 7rem;
    background-color: $image-bg-color;
    border: $image-border;
  }

  &.actions {
    position: absolute;
    width: 100%;
    height: 100%;
    margin: 0;
    border-radius: 50%;
    background: #607d8b;
    border: $image-border;
    opacity: 0.7;
    cursor: pointer;
  }

  &:not(:hover) .actions { display: none; }
}

.croppa-box {
  margin: 0 auto;
  margin-bottom: 10px;
  z-index: 2;

  .croppa-container {
    overflow: hidden;
    border-radius: 50%;
    width: $image-width;
    height: $image-height;
    margin: 0 auto;
    background-color: $image-bg-color;
    border: $image-border;
    cursor: pointer;

    &.croppa--has-target {
      /deep/ {
        canvas {
          width: 100% !important;
          height: 112px !important;
        }
      }

      &:active { cursor: grab; }
      &.croppa--disabled { cursor: auto; }
    }
  }

  .slider-layout {
    margin-top: 8px;
    flex-flow: row nowrap;
    @include flex-container();

    .slider {
      max-width: 15rem;
    }
  }
}
</style>
