<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs3 class="flex-img">
        <v-card class="card-img">
          <croppa
            v-model="croppa"
            :accept="'image/*'"
            :show-remove-button="false"
            @file-choose="saveCroppedImage"
            auto-sizing
            show-loading
            prevent-white-space>
          </croppa>
          <v-card-actions class="img-actions">
            <v-btn :color="primaryColor" @click="doneEditing" flat large>
              <span class="mdi mdi-image"></span>
              Done editing
            </v-btn>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn :color="dangerColor" @click="removeImage" v-on="on" flat large>
                  <span class="mdi mdi-delete"></span>
                </v-btn>
              </template>
              <span>Delete image</span>
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
            <v-btn @click="routeTo('catalog')" flat large>Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <v-snackbar v-model="snackbar" :timeout="timeout" :color="dangerColor" left>
      There is no any file. Please choose an image.
      <v-btn @click="snackbar=false" dark flat>Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import Meta from 'components/common/Meta';
import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import assetsApi from '../../../api/asset.js';
import { mapActions, mapGetters } from 'vuex-module';

const validate = { required: true, min: 2, max: 250 };

export default {
  name: 'user-settings',
  data() {
    return {
      snackbar: false,
      timeout: 2500,
      dangerColor: '#d9534f',
      primaryColor: '#337ab7',
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
    ...mapActions(['updateInfo']),
    updateKey(key, value) {
      const data = cloneDeep(this.user);
      this.updateInfo(set(data, key, value));
    },
    saveCroppedImage(file) {
      const fd = new FormData();
      fd.append('file', file, file.name);
      assetsApi.upload(fd)
      .then(res => {
        console.log(res);
      });
    },
    doneEditing() {
      if (!this.croppa.hasImage()) this.snackbar = true;
      else this.croppa.$props.disabled = true;
    },
    removeImage() {
      this.croppa.remove();
      this.croppa.$props.disabled = false;
    },
    routeTo(name) {
      this.$router.push({ name });
    }
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
  width: 100%;
  margin: auto;
  padding: 0;
  background-color: #f5f5f5;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.4);
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
      color: #337ab7;
    }
  }
}

.img-actions {
  display: inline-block;
  width: 100%;
  padding: 20px;
}

.card-img {
  width: 100%;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}

.flex-img {
  max-width: 80% !important;
  margin-left: 40px;
}

.flex-general {
  margin-left: 70px;
}
</style>
