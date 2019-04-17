<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs3 class="flex-img">
        <v-card class="card-img">
          <croppa
            v-model="croppa"
            :accept="'image/*'"
            :width="230"
            :height="230"
            :show-remove-button="false"
            :disabled="disabled"
            :initial-image="currentImage"
            @file-choose="uploadCroppedImage"
            prevent-white-space
            show-loading>
          </croppa>
          <v-divider></v-divider>
          <v-card-actions class="img-actions">
            <div class="zoom-actions">
              <v-btn @click="handleZoom('zoomIn')" flat small fab>
                <span class="mdi mdi-plus"></span>
              </v-btn>
              <v-btn @click="handleZoom('zoomOut')" flat small fab>
                <span class="mdi mdi-minus"></span>
              </v-btn>
            </div>
            <v-btn @click="doneEditing" color="light-blue darken-3" flat small>
              <span class="mdi mdi-image"></span>
              Done editing
            </v-btn>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn @click="removeImage" v-on="on" color="red darken-2" flat small>
                  <span class="mdi mdi-delete"></span>
                </v-btn>
              </template>
              <span>Delete image</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn @click="editImage" v-on="on" color="cyan darken-1" flat small>
                  <span class="mdi mdi-pencil"></span>
                </v-btn>
              </template>
              <span>Edit image</span>
            </v-tooltip>
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
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <v-snackbar v-model="error" :timeout="timeout" color="red darken-2" left>
      There is no any file. Please choose an image.
      <v-btn @click="error=false" dark flat>Close</v-btn>
    </v-snackbar>
    <v-snackbar v-model="success" :timeout="timeout" color="green darken-1" left>
      Changes saved.
      <v-btn @click="success=false" dark flat>Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import assetsApi from '../../../api/asset.js';
import cloneDeep from 'lodash/cloneDeep';
import { mapActions, mapGetters } from 'vuex-module';
import Meta from 'components/common/Meta';
import set from 'lodash/set';

const validate = { required: true, min: 2, max: 250 };

export default {
  name: 'user-settings',
  data() {
    return {
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
    ...mapActions(['updateInfo', 'saveImageUrl', 'deleteImageUrl']),
    updateKey(key, value) {
      const data = cloneDeep(this.user);
      this.updateInfo(set(data, key, value));
    },
    uploadCroppedImage(file) {
      const formData = new FormData();
      formData.append('file', file, file.name);
      assetsApi.upload(formData)
        .then(res => (this.currentImage = res.key));
    },
    editImage() {
      if (!this.croppa.hasImage()) return;
      this.disabled = false;
    },
    handleZoom(zoom) {
      if (this.disabled) return;
      if (zoom === 'zoomIn') this.croppa.zoomIn();
      else this.croppa.zoomOut();
    },
    doneEditing() {
      if (!this.croppa.hasImage()) {
        this.error = true;
        return;
      }
      if (this.disabled) return;
      this.croppa.generateBlob(editedImage => {
        const formData = new FormData();
        formData.append('file', editedImage);
        assetsApi.upload(formData)
          .then(res => res.key)
          .then(key => this.saveImageUrl({ UserId: this.user.id, key }))
          .then(() => (this.currentImage = this.user.imgUrl));
        this.success = true;
        this.disabled = true;
      });
    },
    removeImage() {
      this.deleteImageUrl({ UserId: this.user.id })
        .then(() => this.croppa.remove());
      this.disabled = false;
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
    this.disabled = true;
  },
  components: { MetaInput: Meta }
};
</script>

<style lang="scss" scoped>
.mdi {
  margin-right: 10%;
  font-size: 20px;
}

.croppa-container {
  display: inline-block;
  width: 230px;
  height: 230px;
  margin: auto;
  margin-top: 5%;
  padding: 0;
  background-color: #f5f5f5;
  border: 1px solid #e3e3e3;
}

.croppa-container:hover {
  cursor: pointer;
}

.zoom-actions {
  display: inline-block;

  .v-btn {
    padding-left: 3%;
    color: #000;
  }
}

.img-actions {
  display: inline-block;
  width: 100%;
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
}

.flex-img {
  max-width: 100% !important;
  margin-left: 40px;
}

.flex-general {
  margin-left: 70px;
}
</style>
