<template>
  <div class="image-toolbar">
    <ul>
      <li class="btn btn-link btn-sm upload-button">
        <label for="upload" class="upload-label">
          <span class="mdi mdi-image"></span> Upload
          <input @change="upload" type="file" id="upload" class="upload-input"/>
        </label>
      </li>
      <li
        v-if="isUploaded"
        :class="{ 'active': currentTool === 'cropper' }"
        @click="toggleTool('cropper')"
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
import EventBus from 'EventBus';
import isEmpty from 'lodash/isEmpty';

const teChannel = EventBus.channel('te');

export default {
  props: ['element'],
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
      // TODO: Show global error modal if invalid
      // const isValid = image && image.type.match('image.*');
      // if (!isValid) ...
      const reader = new window.FileReader();
      reader.readAsDataURL(image);
      reader.addEventListener('load', e => {
        teChannel.emit(`${this.element._cid}/upload`, e.target.result);
      });
    },
    toggleTool(tool) {
      const show = this.currentTool !== tool;
      const prefix = show ? 'show' : 'hide';
      teChannel.emit(`${this.element._cid}/${prefix}${capitalize(tool)}`);
      this.currentTool = show ? tool : null;
    },
    crop() {
      teChannel.emit(`${this.element._cid}/crop`);
    },
    undo() {
      teChannel.emit(`${this.element._cid}/undo`);
    },
    reset() {
      if (!this.currentTool) return;
      teChannel.emit(`${this.element._cid}/hide${capitalize(this.currentTool)}`);
      this.currentTool = null;
    }
  },
  beforeDestroy() {
    this.reset();
  }
};
</script>

<style lang="scss" scoped>
.image-toolbar {
  position: relative;
  width: 100%;
  height: 50px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.34);

  ul {
    float: left;
    height: 100%;
    margin: 0;
    padding: 0 30px 0 10px;

    li {
      height: 100%;
      padding-top: 15px;
      color: #444;

      .fa {
        margin-right: 5px;
        font-size: 20px;
        line-height: 20px;
        vertical-align: bottom;
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
    padding: 15px 10px 5px 10px;
    cursor: pointer;
  }

  .upload-input {
    display: none;
  }

  .tool {
    float: left;
    padding: 12px 20px 0 20px;

    .btn {
      margin-left: 5px;
    }
  }
}
</style>
