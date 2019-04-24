<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs3 class="flex-img">
        <v-card class="card-img">
          <div class="header">
            <croppa
              v-model="croppa"
              :accept="'image/*'"
              :width="230"
              :height="230"
              :show-remove-button="false"
              :disabled="disabled"
              :initial-image="currentImage"
              @file-choose="uploadCroppedImage"
              placeholder=""
              prevent-white-space
              show-loading>
              <div>
                <div v-if="!isEditing && !currentImage" class="croppa-tools">
                  <v-icon class="placeholder-icon">mdi-account</v-icon>
                </div>
                <div v-if="!isEditing" class="croppa-tools actions">
                  <v-icon @click="editImage" dark>mdi-pencil</v-icon>
                  <v-icon v-if="currentImage" @click="removeImage" dark>mdi-delete</v-icon>
                </div>
              </div>
            </croppa>
          </div>
          <v-card-actions class="img-actions">
            <div v-if="currentImage && !disabled" class="edit-actions">
              <v-btn @click="handleZoom('zoomIn')" flat fab>
                <v-icon>mdi mdi-magnify-plus</v-icon>
              </v-btn>
              <v-btn @click="handleZoom('zoomOut')" flat fab>
                <v-icon>mdi mdi-magnify-minus</v-icon>
              </v-btn>
              <v-flex pa-3>
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
      </v-flex>
      <v-flex md8 class="flex-general">
        <v-card class="card-general">
          <meta-input
            v-for="it in requiredData"
            :meta="it"
            :key="it.key"
            @update="updateKey"
            class="meta-input">
          </meta-input>
          <v-card-actions class="form-actions">
            <v-btn @click="routeTo('catalog')" color="light-blue darken-3" flat large>
              Return
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <v-snackbar v-model="error" :timeout="timeout" color="error" left>
      An error has occurred!
      <v-btn @click="error=false" dark flat>Close</v-btn>
    </v-snackbar>
    <v-snackbar v-model="success" :timeout="timeout" color="success" left>
      Changes saved.
      <v-btn @click="success=false" dark flat>Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import assetsApi from '../../../api/asset.js';
import cloneDeep from 'lodash/cloneDeep';
import EventBus from 'EventBus';
import { mapActions, mapGetters } from 'vuex-module';
import Meta from 'components/common/Meta';
import set from 'lodash/set';

const appChannel = EventBus.channel('app');

const validate = { required: true, min: 2, max: 250 };

export default {
  name: 'user-settings',
  data() {
    return {
      isEditing: false,
      disabled: false,
      currentImage: null,
      success: false,
      error: false,
      timeout: 2500,
      croppa: {}
    };
  },
  computed: {
    ...mapGetters(['user']),
    requiredData() {
      return [{
        key: 'role',
        editing: false,
        value: this.user.role,
        type: 'INPUT',
        label: 'Role',
        validate
      }, {
        key: 'email',
        editing: true,
        value: this.user.email,
        type: 'INPUT',
        label: 'Email',
        validate
      }, {
        key: 'firstName',
        editing: true,
        value: this.user.firstName,
        type: 'INPUT',
        label: 'First name',
        validate
      }, {
        key: 'lastName',
        editing: true,
        value: this.user.lastName,
        type: 'INPUT',
        label: 'Last name',
        validate
      }];
    }
  },
  methods: {
    ...mapActions(['updateInfo', 'updateImageUrl']),
    updateKey(key, value) {
      const data = cloneDeep(this.user);
      this.updateInfo(set(data, key, value));
    },
    uploadCroppedImage(file) {
      const formData = new FormData();
      formData.append('file', file, file.name);
      return assetsApi.upload(formData)
        .then(({ key }) => {
          this.currentImage = key;
          this.isEditing = true;
        })
        .catch(() => (this.error = true));
    },
    editImage() {
      if (!this.croppa.hasImage()) {
        this.croppa.chooseFile();
        return;
      }
      this.isEditing = true;
      this.disabled = false;
    },
    handleZoom(zoom) {
      if (this.disabled) return;
      if (zoom === 'zoomIn') return this.croppa.zoomIn();
      this.croppa.zoomOut();
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
            this.success = true;
            this.isEditing = false;
            this.disabled = true;
          });
      });
    },
    cancelEditing() {
      if (!this.user.imgUrl) {
        this.currentImage = null;
        this.isEditing = false;
        return this.croppa.remove();
      }
      this.croppa.refresh();
      this.isEditing = false;
      this.disabled = true;
    },
    removeImage() {
      if (!this.croppa.hasImage()) return;
      appChannel.emit('showConfirmationModal', {
        title: 'Delete image?',
        message: 'Are you sure you want to delete current image?',
        action: () => {
          return this.updateImageUrl({ key: '' })
            .then(() => {
              this.croppa.remove();
              this.currentImage = null;
              this.disabled = false;
            });
        }
      });
    },
    routeTo(name) {
      this.$router.push({ name });
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
  },
  components: { MetaInput: Meta }
};
</script>

<style lang="scss" scoped>
.croppa-container {
  display: inline-block;
  position: relative;
  height: 235px;
  margin: auto;
  margin-top: 5%;
  border-radius: 50%;
  overflow: hidden;
  padding: 0;
  background-color: #f5f5f5;
  border: 4px solid #e3e3e3;
  cursor: pointer;

  .croppa-tools {
    display: flex;
    justify-content: center;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    &.actions {
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

.croppa--has-target.croppa--disabled {
  cursor: auto;
}

.edit-actions {
  display: block;

  .v-btn {
    color: #546e7a;
  }
}

.img-actions {
  display: inline-block;
  width: 100%;
  margin-top: 25%;
  padding: 20px;
}

.card-general {
  width: 100%;
  padding: 30px 30px;
  text-align: left;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);

  .meta-input {
    margin: 10px 0;
  }

  .form-actions {
    min-height: 36px;

    .v-btn {
      margin-left: auto;
      padding: 8px 12px;
    }
  }
}

.card-img {
  width: 100%;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);

  .header {
    height: 160px;
    background: rgb(63, 81, 181);
  }
}

.flex-img {
  max-width: 100% !important;
  margin-left: 40px;
}

.flex-general {
  margin-left: 70px;
}
</style>
