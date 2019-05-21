<template>
  <v-layout class="main-box">
    <v-flex class="header">
      <v-card class="elevation-2" color="blue-grey darken-2" dark>
        <v-card-title>
          <v-icon>mdi-pencil</v-icon>
          <h4 class="title">Edit Profile</h4>
        </v-card-title>
      </v-card>
    </v-flex>
    <v-layout class="layout-box">
      <v-flex class="profile-photo-box">
        <div v-if="!disabled" v-show="isEditing" class="croppa-box">
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
          <v-layout v-if="isEditing" class="slider-layout">
            <v-flex>
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
        <v-avatar v-if="!isEditing" :size="options.height">
          <img v-if="currentImage" :src="currentImage">
          <v-icon v-else class="placeholder-icon" color="grey">mdi-account</v-icon>
          <div @click="uploadNewImage" class="v-avatar actions">
            <v-icon dark>mdi-camera</v-icon>
          </div>
        </v-avatar>
      </v-flex>
      <v-flex class="info-box">
        <v-card flat>
          <v-card-title>
            <v-icon color="pink">mdi-account-star</v-icon>
            <h4 class="title">{{ user.role }}</h4>
          </v-card-title>
          <v-list>
            <v-list-tile avatar>
              <v-list-tile-content>
                <v-list-tile-title class="list-title">
                  {{ user.email }}
                </v-list-tile-title>
                <v-list-tile-sub-title class="list-title">
                  {{ user.firstName }} {{ user.lastName }}
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
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
        .then(({ data }) => this.updateInfo({ imgUrl: data.key }))
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
    this.disabled = true;
    this.currentImage = this.user.imgUrl;
  }
};

function generateBlob(croppa) {
  return new Promise(resolve => croppa.generateBlob(resolve));
}
</script>

<style lang="scss" scoped>
$image-border: 4px solid #e3e3e3;
$image-bg-color: #f5f5f5;

@mixin flex-container-setup ($flex-flow, $justify-content: center) {
  display: flex;
  flex-flow: $flex-flow;
  justify-content: $justify-content;
}

.flex-item-setup {
  flex: 0 50%;
}

.main-box {
  margin: 0;
  @include flex-container-setup($flex-flow: column nowrap);
}

.title {
  margin-bottom: 8px;
  font-weight: 300;
}

.header {
  margin-top: -40px;
  padding: 16px 16px;

  .v-icon {
    margin-right: 8px;
  }
}

.layout-box {
  margin: 0;
  @include flex-container-setup($flex-flow: row wrap);

  .profile-photo-box {
    margin-top: 8px;
    @extend .flex-item-setup;
  }

  .info-box {
    padding-left: 24px;
    @extend .flex-item-setup;

    .v-icon {
      margin-right: 8px;
    }

    .list-title {
      margin-bottom: 8px;
      font-weight: 300;
    }
  }
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

  .slider-layout {
    margin-top: 8px;
    @include flex-container-setup(row nowrap);

    .flex {
      max-width: 50%;
      @extend .flex-item-setup;
    }
  }
}
</style>
