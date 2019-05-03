<template>
  <v-card flat class="card-img">
    <div class="header">
      <v-avatar :size="options.height">
        <croppa
          v-if="isEditing || !currentImage"
          v-model="croppa"
          v-bind="options"
          @file-choose="uploadCroppedImage"
          @new-image-drawn="onNewImage"
          @zoom="onZoom"
          @dblclick="onZoom"
          placeholder=""
          prevent-white-space
          show-loading>
        </croppa>
        <img v-if="!isEditing" :src="currentImage">
        <div>
          <div v-if="!isEditing && !currentImage" class="croppa-tools">
            <v-icon class="placeholder-icon">mdi-account</v-icon>
          </div>
          <div v-if="!isEditing" class="croppa-tools actions">
            <v-icon v-if="!currentImage" @click="editImage" dark>mdi-camera</v-icon>
            <v-icon v-else @click="editImage" dark>mdi-pencil</v-icon>
            <v-icon v-if="currentImage" @click="removeImage" dark>mdi-delete</v-icon>
          </div>
        </div>
      </v-avatar>
    </div>
    <v-layout v-if="isEditing" pt-5 mt-2 row justify-center>
      <v-flex xs7>
        <v-slider
          v-model="sliderVal"
          :min="sliderMin"
          :max="sliderMax"
          @input="onSliderChange"
          @click:append="croppa.zoomIn()"
          @click:prepend="croppa.zoomOut()"
          append-icon="mdi-plus"
          prepend-icon="mdi-minus"
          step=".001">
        </v-slider>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import EventBus from 'EventBus';
import { mapActions, mapGetters } from 'vuex-module';

const appChannel = EventBus.channel('app');

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
      showRemoveButton: false,
      initialImage: vm.currentImage
    })
  },
  methods: {
    ...mapActions(['updateInfo', 'uploadAvatar']),
    uploadCroppedImage(file) {
      if (!file) return this.$emit('editing', false);
      this.$emit('editing', true);
      this.disabled = false;
    },
    editImage() {
      if (!this.currentImage) {
        this.croppa.chooseFile();
        return;
      }
      this.$emit('editing', true);
      this.disabled = false;
    },
    doneEditing() {
      if (this.disabled) return;
      generateBlob(this.croppa)
        .then(editedImage => {
          const formData = new FormData();
          formData.append('file', editedImage);
          return this.uploadAvatar(formData);
        })
        .then(({ data }) => this.updateInfo({ key: data.key }))
        .then(() => (this.currentImage = this.user.imgUrl))
        .finally(() => this.$emit('editing', false));
    },
    onNewImage() {
      this.sliderVal = this.sliderMin = this.croppa.scaleRatio;
      this.sliderMax = this.croppa.scaleRatio * 2;
    },
    onSliderChange(val) {
      this.croppa.scaleRatio = val;
    },
    onZoom(e) {
      if (!e) return (this.sliderVal = this.croppa.scaleRatio);
      this.croppa.scaleRatio *= 1.2;
      this.sliderVal = this.croppa.scaleRatio;
    },
    removeImage() {
      if (!this.currentImage) return;
      appChannel.emit('showConfirmationModal', {
        title: 'Delete image?',
        message: 'Are you sure you want to delete current image?',
        action: () => {
          this.currentImage = null;
          this.disabled = false;
          this.$snackbar.info('Profile photo deleted.');
          return this.updateInfo({ key: '' });
        }
      });
    }
  },
  watch: {
    isEditing(newValue) {
      if (!newValue) return this.croppa.remove();
    }
  },
  created() {
    if (!this.user.imgUrl) {
      this.disabled = false;
      return;
    }
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
  display: inline-block;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  margin: auto;
  margin-top: 10%;

  .croppa-tools {
    display: flex;
    justify-content: center;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    &.actions {
      margin: 4px;
      border-radius: 50%;
      background: #546e7a;
      opacity: 0.7;

      > :not(:last-child) { margin-right: 2rem; }
    }

    .placeholder-icon {
      font-size: 7rem;
      opacity: 0.7;
    }
  }

  &:not(:hover) .actions { display: none; }
}

.croppa-container {
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  border-radius: 50%;
  overflow: hidden;
  background-color: #f5f5f5;
  border: 4px solid #e3e3e3;
  cursor: pointer;

  &.croppa--has-target {

    &:active { cursor: grab; }
    &.croppa--disabled { cursor: auto; }
  }
}

img {
  background-color: #f5f5f5;
  border: 4px solid #e3e3e3;
}

.card-img {
  display: block;
  position: relative;
  width: 100%;

  .header {
    position: relative;
    height: 110px;
    margin-bottom: 5%;
    background: #0277bd;
  }
}
</style>
