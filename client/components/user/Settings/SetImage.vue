<template>
  <v-card class="card-img">
    <div class="header">
      <v-avatar :size="options.height">
        <croppa
          v-if="isEditing || !currentImage"
          v-model="croppa"
          v-bind="options"
          @file-choose="uploadCroppedImage"
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
    <v-card-actions class="img-actions">
      <div v-if="isEditing" class="edit-actions">
        <v-layout mt-4 row justify-space-around>
          <v-btn @click="croppa.zoomIn()" color="blue-grey" flat fab>
            <v-icon>mdi mdi-magnify-plus</v-icon>
          </v-btn>
          <v-btn @click="croppa.zoomOut()" color="blue-grey" flat fab>
            <v-icon>mdi mdi-magnify-minus</v-icon>
          </v-btn>
        </v-layout>
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
      </div>
    </v-card-actions>
  </v-card>
</template>

<script>
import assetsApi from '../../../api/asset';
import EventBus from 'EventBus';
import { mapActions, mapGetters } from 'vuex-module';

const appChannel = EventBus.channel('app');

export default {
  name: 'user-settings',
  data() {
    return {
      isEditing: false,
      disabled: false,
      currentImage: null,
      timeout: 2500,
      croppa: {}
    };
  },
  computed: {
    ...mapGetters(['user']),
    options() {
      return {
        accept: 'image/*',
        width: 200,
        height: 200,
        disabled: this.disabled,
        showRemoveButton: false,
        initialImage: this.currentImage
      };
    }
  },
  methods: {
    ...mapActions(['updateImageUrl']),
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
    doneEditing() {
      if (this.disabled) return;
      this.croppa.generateBlob(editedImage => {
        const formData = new FormData();
        formData.append('file', editedImage);
        return assetsApi.upload(formData)
          .then(({ key }) => this.updateImageUrl({ key }))
          .then(() => {
            this.currentImage = this.user.imgUrl;
            this.$emit('message', true);
          })
          .finally(() => {
            this.isEditing = false;
            this.disabled = true;
          });
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
          return this.updateImageUrl({ key: '' });
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
      font-size: 10rem;
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
  height: 200px;
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

.img-actions {
  display: inline-block;
  width: 100%;
  margin-top: 20%;
}

.card-img {
  display: block;
  position: relative;
  width: 35%;
  background-color: white;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.4);

  .header {
    position: relative;
    height: 130px;
    background: rgb(63, 81, 181);
  }
}
</style>
