<template>
  <div class="image-toolbar">
    <div v-if="!isUploaded" class="file-upload">
      <label>
        <input @change="upload" type="file"/>
        <span class="btn btn-success btn-sm">
          <span class="fa fa-upload"></span> Upload image
        </span>
      </label>
    </div>
    <ul v-if="isUploaded">
      <li
        @click="emit(event.clear)"
        class="btn btn-link btn-sm">
        <span class="fa fa-image"></span> New
      </li>
      <li
        :class="{ 'active': tool === event.crop }"
        @click="toggleTool(event.crop)"
        class="btn btn-link btn-sm">
        <span class="fa fa-crop"></span> Crop
      </li>
    </ul>
    <div v-if="tool === event.crop" class="tool">
      <button @click="emit(event.reset)" class="btn btn-default btn-sm">
        Undo
      </button>
      <button @click="emit(event.crop)" class="btn btn-success btn-sm">
        Crop
      </button>
    </div>
  </div>
</template>

<script>
import actions from './toolbarActions';
import capitalize from 'lodash/capitalize';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import zipObject from 'lodash/zipObject';

export default {
  props: ['element'],
  data() {
    return {
      tool: null
    };
  },
  computed: {
    event() {
      // Namespace events
      const events = ['clear', 'reset', 'upload', 'crop'];
      const id = this.element.embedded ? this.element.id : this.element._cid;
      return zipObject(events, map(events, it => `${it}/${id}`));
    },
    isUploaded() {
      return this.element.data && this.element.data.url;
    }
  },
  methods: {
    emit(name) {
      actions.$emit(name);
    },
    upload({ target }) {
      this.reset();
      const image = !isEmpty(target.files) ? target.files[0] : null;
      // TODO: Show global error modal if invalid
      // const isValid = image && image.type.match('image.*');
      // if (!isValid) ...
      const reader = new window.FileReader();
      reader.onload = e => actions.$emit(this.event.upload, e.target.result);
      reader.readAsDataURL(image);
    },
    toggleTool(tool) {
      const show = this.tool !== tool;
      const prefix = show ? 'show' : 'hide';
      this.emit(`${prefix}${capitalize(tool)}`);
      this.tool = show ? tool : null;
    },
    reset() {
      if (!this.tool) return;
      this.emit(`hide${capitalize(this.tool)}`);
      this.tool = null;
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

  .tool {
    float: left;
    padding: 12px 20px 0 20px;

    .btn {
      margin-left: 5px;
    }
  }
}

.file-upload {
  input {
    display: none;
  }

  .btn {
    margin-top: 12px;
  }
}
</style>
