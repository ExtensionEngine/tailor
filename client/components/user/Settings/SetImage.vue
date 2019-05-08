<template>
  <v-layout column mr-0 ml-0>
    <v-toolbar class="elevation-0" height="113" color="light-blue darken-3" dark>
    </v-toolbar>
    <v-avatar :size="options.height">
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
      <div v-if="!isEditing" class="img-container">
        <img v-if="currentImage" :src="currentImage">
        <v-icon v-else class="placeholder-icon">mdi-account</v-icon>
        <div @click="uploadNewImage" class="img-container actions">
          <v-icon dark>mdi-camera</v-icon>
        </div>
      </div>
    </v-avatar>
    <v-layout v-if="isEditing" justify-center>
      <v-flex xs6>
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
      </v-flex>
    </v-layout>
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
      this.croppa.chooseFile();
    },
    doneEditing() {
      if (this.disabled) return;
      if (!this.$props.isEditing) return;
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
          this.croppa.refresh();
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
      if (!newValue) return this.croppa.refresh();
    }
  },
  created() {
    this.currentImage = this.user.imgUrl;
  }
};

function generateBlob(croppa) {
  return new Promise(resolve => croppa.generateBlob(resolve));
}
</script>

<style lang="scss" scoped>
nav {
  margin-bottom: 65px;
}

.v-avatar {
  display: inline-block;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  margin: auto;
  margin-top: 45px;

  .img-container {
    display: flex;
    position: absolute;
    justify-content: center;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

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
      margin: 4px;
      border-radius: 50%;
      background: #546e7a;
      opacity: 0.7;
      cursor: pointer;
    }
  }

  &:not(:hover) .actions { display: none; }
}

.croppa-container {
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
</style>
