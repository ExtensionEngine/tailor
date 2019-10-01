<template>
  <div class="tce-image-toolbar">
    <ul>
      <v-btn text tile class="upload-button">
        <label for="upload" class="upload-label">
          <v-icon small left>mdi-image</v-icon>Upload
          <input @change="upload" id="upload" type="file" class="upload-input">
        </label>
      </v-btn>
      <v-btn
        v-if="isUploaded"
        @click="toggleTool('cropper')"
        :class="{ 'active': currentTool === 'cropper' }"
        tile
        text>
        <v-icon small left>mdi-crop</v-icon>Crop
      </v-btn>
    </ul>
    <div v-if="currentTool === 'cropper'" class="tool">
      <v-btn @click="undo" small depressed>Undo</v-btn>
      <v-btn @click="crop" small depressed color="success">Crop</v-btn>
    </div>
  </div>
</template>

<script>
import capitalize from 'lodash/capitalize';
import isEmpty from 'lodash/isEmpty';

export default {
  inject: ['$elementBus'],
  props: {
    element: { type: Object, required: true }
  },
  data() {
    return {
      currentTool: null
    };
  },
  computed: {
    isUploaded() {
      return this.element.data && this.element.data.url;
    }
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
  }
};
</script>

<style lang="scss" scoped>
.tce-image-toolbar {
  position: relative;
  width: 100%;
  height: 50px;

  ul {
    float: left;
    height: 100%;
    padding: 0 30px 0 10px;

    .v-btn {
      height: 100%;

      &.active {
        background-color: #e8e8e8;
      }
    }

    .upload-button {
      padding: 0;
    }
  }

  .upload-label {
    padding: 16px;
    cursor: pointer;
  }

  .upload-input {
    display: none;
  }

  .tool {
    float: left;
    padding: 12px 20px 0;

    .btn {
      margin-left: 5px;
    }
  }
}
</style>
