<template>
  <v-card class="card-img">
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
            <v-icon @click="editImage" dark>mdi-pencil</v-icon>
            <v-icon v-if="currentImage" @click="removeImage" dark>mdi-delete</v-icon>
          </div>
        </div>
      </v-avatar>
    </div>
    <v-card-actions>
      <v-container v-if="isEditing" mt-5 fluid grid-list-lg>
        <v-layout mt-4 row wrap>
          <v-flex xs12>
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
          <v-flex pa-4 d-flex>
            <v-btn @click="doneEditing" color="light-blue darken-3" flat large>
              <v-icon dark>mdi-image</v-icon>
              Save
            </v-btn>
            <v-btn @click="cancelEditing" color="blue-grey" flat large>
              <v-icon dark>mdi-close</v-icon>
              Cancel
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-actions>
  </v-card>
</template>

<script>
import assetsApi from '@/api/asset';
import EventBus from 'EventBus';
import { mapActions, mapGetters } from 'vuex-module';

const appChannel = EventBus.channel('app');

export default {
  name: 'user-settings',
  data: () => ({
    isEditing: false,
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
      width: 150,
      height: 150,
      disabled: vm.disabled,
      showRemoveButton: false,
      initialImage: vm.currentImage
    })
  },
  methods: {
    ...mapActions(['updateInfo']),
    uploadCroppedImage() {
      this.isEditing = true;
      this.disabled = false;
    },
    editImage() {
      if (!this.currentImage) {
        this.croppa.chooseFile();
        return;
      }
      this.isEditing = true;
      this.disabled = false;
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
    doneEditing() {
      if (this.disabled) return;
      generateBlob(this.croppa)
        .then(editedImage => {
          const formData = new FormData();
          formData.append('file', editedImage);
          return assetsApi.upload(formData);
        })
        .then(({ key }) => this.updateInfo({ key }))
        .then(() => {
          this.currentImage = this.user.imgUrl;
          this.$snackbar.success('Profile photo changed.');
        })
        .finally(() => {
          this.isEditing = false;
          this.disabled = true;
        });
    },
    cancelEditing() {
      if (!this.user.imgUrl) {
        this.isEditing = false;
        return this.croppa.remove();
      }
      this.croppa.refresh();
      this.isEditing = false;
      this.disabled = true;
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
  created() {
    if (!this.user.imgUrl) {
      this.disabled = false;
      return;
    }
    this.currentImage = this.user.imgUrl;
    this.isEditing = false;
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
  margin-top: 5%;

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
      font-size: 8rem;
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
  height: 150px;
  margin: auto;
  border-radius: 50%;
  overflow: hidden;
  padding: 0;
  background-color: #f5f5f5;
  border: 4px solid #e3e3e3;
  cursor: pointer;

  &.croppa--has-target {

    &:active { cursor: grab; }
    &.croppa--disabled { cursor: auto; }
  }
}

img {
  border: 4px solid #e3e3e3;
}

.card-img {
  display: block;
  position: relative;
  width: 35%;
  background-color: white;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.4);

  .header {
    position: relative;
    height: 100px;
    background: rgb(63, 81, 181);
  }
}
</style>
