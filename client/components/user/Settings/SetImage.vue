<template>
  <v-layout column mr-0 ml-0>
    <v-toolbar class="elevation-0" height="113" color="light-blue darken-3" dark>
    </v-toolbar>
    <div v-if="!disabled || !currentImage" class="croppa-box">
      <croppa
        v-model="croppa"
        v-bind="options"
        @new-image-drawn="onNewImage"
        @file-choose="uploadImage"
        @zoom="onZoom"
        @dblclick="onZoom"
        placeholder=""
        prevent-white-space
        show-loading>
      </croppa>
      <v-layout v-if="isEditing" px-5 mx-5 mt-2 justify-center>
        <v-slider
          v-model="sliderVal"
          :min="sliderMin"
          :max="sliderMax"
          :hide-details="true"
          @input="onSliderChange"
          @click:append="croppa.zoomIn()"
          @click:prepend="croppa.zoomOut()"
          append-icon="mdi-plus"
          prepend-icon="mdi-minus"
          step=".001">
        </v-slider>
      </v-layout>
    </div>
    <v-avatar
      v-if="!isEditing"
      :size="options.height"
      :class="{ 'avatar-style': !disabled || !currentImage}">
      <img v-if="currentImage" :src="currentImage">
      <v-icon v-else class="placeholder-icon">mdi-account</v-icon>
      <div @click="uploadNewImage" class="v-avatar actions">
        <v-icon dark>mdi-camera</v-icon>
      </div>
    </v-avatar>
  </v-layout>
</template>

<script>
import { mapActions, mapGetters } from 'vuex-module';

export default {
  name: 'user-settings',
  props: {
    isEditing: { type: Boolean, default: false }
  },
  data: () => ({
    disabled: false,
    currentImage: null,
    timeout: 2500,
    sliderVal: 0,
    sliderMin: 0,
    sliderMax: 0,
    croppa: {}
  }),
  computed: {
    ...mapGetters(['user']),
    options: vm => ({
      accept: 'image/*',
      width: 130,
      height: 130,
      disabled: vm.disabled,
      showRemoveButton: false
    })
  },
  methods: {
    ...mapActions(['updateInfo', 'uploadAvatar']),
    uploadImage(file) {
      if (!file) return this.$emit('editing', false);
      this.$emit('editing', true);
    },
    uploadNewImage() {
      this.disabled = false;
      this.$nextTick(() => this.croppa.chooseFile());
    },
    doneEditing() {
      if (this.disabled) return;
      if (!this.isEditing) return;
      generateBlob(this.croppa)
        .then(editedImage => {
          const formData = new FormData();
          formData.append('file', editedImage);
          return this.uploadAvatar(formData);
        })
        .then(({ data }) => this.updateInfo({ key: data.key }))
        .then(() => {
          this.currentImage = this.user.imgUrl;
          this.$snackbar.success('Profile photo updated.');
        })
        .catch(() => this.$snackbar.error('An error has occurred!'))
        .finally(() => {
          this.$emit('editing', false);
          this.disabled = true;
        });
    },
    onNewImage() {
      const { scale } = this.croppa.getMetadata();
      this.sliderVal = this.sliderMin = scale;
      this.sliderMax = scale * 2;
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
    this.currentImage = this.user.imgUrl;
    this.disabled = true;
  }
};

function generateBlob(croppa) {
  return new Promise(resolve => croppa.generateBlob(resolve));
}
</script>

<style lang="scss" scoped>
.v-avatar {
  position: relative;
  margin: 0 auto;
  margin-top: -67px;

  img {
    width: 100%;
    background-color: #f5f5f5;
    border: 4px solid #e3e3e3;
  }

  .placeholder-icon {
    font-size: 7rem;
    opacity: 0.7;
  }

  &.actions {
    position: absolute;
    width: 100%;
    height: 100%;
    margin: 0;
    border-radius: 50%;
    background: #546e7a;
    border: 4px solid #e3e3e3;
    opacity: 0.7;
    cursor: pointer;
  }

  &:not(:hover) .actions { display: none; }
}

.croppa-box {
  margin: auto;
  margin-top: -67px;
  margin-bottom: 20px;
  z-index: 2;

  .croppa-container {
    overflow: hidden;
    border-radius: 50%;
    width: 130px;
    height: 130px;
    margin: 0 auto;
    background-color: #f5f5f5;
    border: 4px solid #e3e3e3;
    cursor: pointer;

    &.croppa--has-target {
      /deep/ {
        canvas {
          width: 100% !important;
          height: 122px !important;
        }
      }

      &:active { cursor: grab; }
      &.croppa--disabled { cursor: auto; }
    }
  }
}

.avatar-style {
  margin-top: -150px;
  z-index: 3;
}
</style>
