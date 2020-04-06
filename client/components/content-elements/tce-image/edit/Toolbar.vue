<template>
  <v-toolbar class="tce-image-toolbar elevation-0">
    <v-toolbar-title class="pl-1">Image toolbar</v-toolbar-title>
    <v-toolbar-items class="mx-auto">
      <upload-btn
        @change="upload"
        :label="isUploaded ? 'Upload new image' : 'Click to upload an image'" />
      <template v-if="isUploaded">
        <v-btn @click="toggleTool('cropper')" small text>
          {{ currentTool === 'cropper' ? 'Hide' : 'Show' }} cropper
        </v-btn>
        <template v-if="currentTool === 'cropper'">
          <v-btn @click="undo" small text>
            <v-icon class="pr-2">mdi-undo</v-icon> Undo crop
          </v-btn>
          <v-btn @click="crop" small text>
            <v-icon class="pr-2">mdi-crop</v-icon> Crop
          </v-btn>
        </template>
      </template>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import capitalize from 'lodash/capitalize';
import isEmpty from 'lodash/isEmpty';
import UploadBtn from './UploadBtn';

export default {
  inject: ['$elementBus'],
  props: {
    element: { type: Object, required: true }
  },
  data: () => ({ currentTool: null }),
  computed: {
    isUploaded: vm => vm.element.data && vm.element.data.url
  },
  methods: {
    upload({ target }) {
      this.reset();
      const image = !isEmpty(target.files) ? target.files[0] : null;
      const reader = new window.FileReader();
      reader.readAsDataURL(image);
      reader.addEventListener('load', e => {
        this.$elementBus.emit('upload', e.target.result);
      });
    },
    toggleTool(tool) {
      const show = this.currentTool !== tool;
      const prefix = show ? 'show' : 'hide';
      this.$elementBus.emit(`${prefix}${capitalize(tool)}`);
      this.currentTool = show ? tool : null;
    },
    crop() {
      this.$elementBus.emit('crop');
    },
    undo() {
      this.$elementBus.emit('undo');
    },
    reset() {
      if (!this.currentTool) return;
      this.$elementBus.emit(`hide${capitalize(this.currentTool)}`);
      this.currentTool = null;
    }
  },
  beforeDestroy() {
    this.reset();
  },
  components: { UploadBtn }
};
</script>

<style lang="scss" scoped>
.tce-image-toolbar {
  position: relative;
  width: 100%;
}

.v-toolbar__title {
  min-width: 23.875rem;
  text-align: left;
}
</style>
