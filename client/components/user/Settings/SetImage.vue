<template>
  <v-layout column mx-0>
    <v-flex pa-3 class="header">
      <v-card class="elevation-2" color="blue-grey" dark>
        <v-card-title>
          <v-icon class="mr-2">mdi-pencil</v-icon>
          <h4 class="title font-weight-light mb-2">Edit Profile</h4>
        </v-card-title>
      </v-card>
    </v-flex>
    <v-layout row wrap mx-0>
      <v-flex xs6 mt-2>
        <div v-if="!disabled" class="croppa-box">
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
          <v-layout v-if="isEditing" mt-2 justify-center>
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
        </div>
        <v-avatar
          v-if="!isEditing"
          :size="options.height"
          :class="{ 'avatar-style': !disabled }">
          <img v-if="currentImage" :src="currentImage">
          <v-icon v-else class="placeholder-icon" color="grey">mdi-account</v-icon>
          <div @click="uploadNewImage" class="v-avatar actions">
            <v-icon dark>mdi-camera</v-icon>
          </div>
        </v-avatar>
      </v-flex>
      <v-flex xs6 pl-4>
        <v-card flat>
          <v-card-title>
            <v-icon class="mr-2" color="pink">mdi-account-star</v-icon>
            <h4 class="title font-weight-light mb-2">{{ user.role }}</h4>
          </v-card-title>
          <v-list-tile avatar>
            <v-list-tile-content>
              <v-list-tile-title class="font-weight-light mb-2">
                {{ user.email }}
              </v-list-tile-title>
              <v-list-tile-sub-title class="font-weight-light mb-2">
                {{ user.firstName }} {{ user.lastName }}
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-card>
      </v-flex>
    </v-layout>
    <v-divider/>
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
$image-border: 4px solid #e3e3e3;
$image-bg-color: #f5f5f5;

.header {
  margin-top: -40px;
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
    width: 130px;
    height: 130px;
    margin: 0 auto;
    background-color: $image-bg-color;
    border: $image-border;
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
  margin-top: -173px;
  z-index: 3;
}
</style>
