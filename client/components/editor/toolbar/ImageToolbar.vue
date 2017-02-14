<template>
  <div class="image-toolbar">
    <div class="col-md-4">
      <ul v-show="isSaved" class="menu">
        <!-- Image dropdown -->
        <li class="menu-item">
          <div class="dropdown">
            <button
              class="btn btn-link btn-menu dropdown-toggle"
              type="button"
              id="image-file"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="true">
                Image
                <span class="fa fa-caret-down"></span>
            </button>
            <ul class="dropdown-menu" aria-labelledby="image-file">
              <li><a @click="emitAction(event.clear)" type="button">Clear</a></li>
            </ul>
          </div>
        </li>

        <!-- Tool dropdown -->
        <li class="menu-item">
          <div class="dropdown">
            <button
              class="btn btn-link btn-menu dropdown-toggle"
              type="button"
              id="image-tool"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="true">
                Tools
                <span class="fa fa-caret-down"></span>
            </button>
            <ul class="dropdown-menu" aria-labelledby="image-tool">
              <li>
                <a
                  @click="setTool(event.showCrop)"
                  :class="activeToolClass(event.showCrop)"
                  type="button">
                    Crop
                </a>
              </li>
            </ul>
          </div>
        </li>

        <!-- Tool items -->
        <li v-show="tool === event.showCrop" class="menu-item">
          <button @click="emitAction(event.reset)" class="btn btn-link btn-menu" title="Reset">
            <span class="fa fa-undo"></span>
          </button>
          <button @click="emitAction(event.crop)" class="btn btn-link btn-menu" title="Crop">
            <span class="fa fa-crop"></span>
          </button>
        </li>
      </ul>
    </div>

    <!-- Image input -->
    <div class="col-md-4">
      <div v-if="!isSaved" class="file-upload">
        <div class="col-md-2 file-input">
          <label>
            <input @change="input($event)" type="file" />
            <span class="fa fa-upload fa-2x"></span>
          </label>
        </div>
        <div class="col-md-10 file-text" :class="errorClass">
          <input type="text" :value="asset.name" disabled readonly />
          <div v-show="error" class="error-message">{{ error }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { concat, isEmpty, map, replace, zipObject } from 'lodash';
import actions from './toolbarActions';

export default {
  name: 'image-toolbar',
  props: ['asset'],
  data() {
    return {
      error: null,
      tool: null
    };
  },
  computed: {
    event() {
      // Namespace event names
      const events = ['clear', 'crop', 'reset', 'upload'];
      const tools = ['showCrop', 'hideCrop'];
      const names = concat(events, tools);
      const namespace = name => `${name}/${this.asset._cid}`;
      return zipObject(names, map(names, e => namespace(e)));
    },
    errorClass() {
      return { 'has-error': this.error };
    },
    isSaved() {
      return !isEmpty(this.asset.data.url);
    }
  },
  methods: {
    input(event) {
      this.resetTool();
      const file = !isEmpty(event.target.files) ? event.target.files[0] : null;
      const image = file && file.type.match('image.*') ? file : null;

      this.error = this.validate(image);
      if (!this.error) this.save(image);
    },
    save(image) {
      // Convert to base64
      const reader = new window.FileReader();
      reader.onload = (e) => {
        const url = e.target.result;
        actions.$emit(this.event.upload, url);
      };
      reader.readAsDataURL(image);
    },
    validate(image) {
      const errorMessage = 'Please upload an image file';
      return !image ? errorMessage : null;
    },
    emitAction(name) {
      actions.$emit(name);
    },
    setTool(name) {
      this.tool = name;
      this.emitAction(this.tool);
    },
    resetTool() {
      // Tool toggling methods should be implemented
      // with 'show' / 'hide' prefix
      if (!isEmpty(this.tool)) {
        const action = replace(this.tool, 'show', 'hide');
        this.tool = null;
        this.emitAction(action);
      }
    },
    activeToolClass(name) {
      return { 'active': name === this.tool };
    }
  },
  beforeDestroy() {
    this.resetTool();
  }
};
</script>

<style lang="scss">
.image-toolbar {
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.34);
  height: 60px;
  position: fixed;
  width: 100%;
  z-index: 999;

  .col-md-4 {
    height: 100%;
    padding: 0;
  }

  .menu {
    height: 100%;
    margin: 0;
    padding: 0;
    text-align: left;

    .menu-item {
      display: inline-block;
      height: 100%;
      min-width: 50px;
      text-align: center;

      .fa {
        font-size: 16px;
      }

      .active {
        background-color: #cecece;
      }
    }

    .dropdown {
      height: 100%;
    }
  }

  .dropdown-menu {
    border-radius: 0;
    left: -2%;
    padding: 0;

    li > a {
      font-size: 14px;
      font-weight: 500;
      padding: 10px 20px;
      text-transform: uppercase;
    }
  }

  .open > .btn-menu.dropdown-toggle {
    &:hover, &:focus {
      background-color: transparent;
      border-color: none;
    }
  }

  .btn-menu {
    box-shadow: none;
    height: 100%;
    outline: 0;

    &:hover {
      background-color: transparent;
      background-image: none;
      border: none;
      box-shadow: none;
      outline: 0;
    }

    &:focus:active {
      background-color: transparent;
      background-image: none;
      border: none;
      box-shadow: none;
      outline: 0;
    }
  }
}

.file-upload {
  .file-input {
    overflow: hidden;
    padding: 12px 0;
    position: relative;
    width: 50px;

    label {
      cursor: pointer;
    }

    input[type="file"] {
      display: none;
    }
  }

  .file-text {
    padding: 17px 5px;

    input[type="text"] {
      border-bottom: 1px solid #b3b3b3;
      width: 100%;
    }

    .error-message {
      color: darken(#d9534f, 15%);
      font-size: 14px;
      font-weight: 500;
      padding: 2px 0;
      text-align: left;
    }
  }
}
</style>
