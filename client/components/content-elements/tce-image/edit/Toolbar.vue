<template>
  <div class="tce-image-toolbar">
    <ul>
      <li class="btn btn-link btn-sm upload-button">
        <label for="upload" class="upload-label">
          <span class="mdi mdi-image"></span> Upload
          <input @change="upload" id="upload" type="file" class="upload-input">
        </label>
      </li>
      <li
        v-if="isUploaded"
        @click="toggleTool('cropper')"
        :class="{ 'active': currentTool === 'cropper' }"
        class="btn btn-link btn-sm">
        <span class="mdi mdi-crop"></span> Crop
      </li>
    </ul>
    <div v-if="currentTool === 'cropper'" class="tool">
      <button @click="undo" class="btn btn-default btn-sm">Undo</button>
      <button @click="crop" class="btn btn-success btn-sm">Crop</button>
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
    margin: 0;
    padding: 0 30px 0 10px;

    li {
      height: 100%;
      padding-top: 15px;
      color: #444;

      .mdi {
        display: inline-block;
        margin-right: 5px;
        font-size: 20px;
        line-height: 20px;
        vertical-align: middle;
      }

      &.active {
        background-color: #e8e8e8;
      }
    }
  }

  .upload-button {
    padding: 0;
  }

  .upload-label {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 15px 10px 5px;
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
