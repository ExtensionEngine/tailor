<template>
  <div class="image-toolbar">
    <div class="col-md-4">
      <ul v-show="isUploaded" class="menu">
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
              <li><a @click="emitAction(action.clear)" type="button">Clear</a></li>
              <li><a @click="emitAction(action.reset)" type="button">Reset</a></li>
            </ul>
          </div>
        </li>
        <li class="menu-item">
          <button @click="emitAction(action.crop)" class="btn btn-link btn-menu" title="Crop">
            <span class="fa fa-crop"></span>
          </button>
        </li>
      </ul>
    </div>

    <div class="col-md-4">
      <div v-show="!isUploaded" class="file-upload">
        <div class="col-md-2 file-input">
          <label>
            <input @change="input" type="file" />
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
import { isEmpty, map, zipObject } from 'lodash';
import actions from './toolbarActions';

export default {
  name: 'image-toolbar',
  props: ['asset'],
  data() {
    return {
      error: null
    };
  },
  computed: {
    action() {
      // Namespace event names
      const events = ['clear', 'crop', 'reset', 'upload'];
      const namespaceEvent = name => `${name}/${this.asset._cid}`;
      return zipObject(events, map(events, e => namespaceEvent(e)));
    },
    errorClass() {
      return { 'has-error': this.error };
    },
    isUploaded() {
      return this.asset.url && !isEmpty(this.asset.url);
    }
  },
  methods: {
    input(event) {
      const input = event.target;
      const file = !isEmpty(input.files) ? input.files[0] : null;
      const image = file && file.type.match('image.*') ? file : null;

      this.error = this.validate(file, image);
      if (!this.error) this.save(image);
    },
    save(image) {
      // Convert to base64
      const reader = new window.FileReader();
      reader.onload = (e) => {
        const url = e.target.result;
        actions.$emit(this.action.upload, url);
      };
      reader.readAsDataURL(image);
    },
    validate(file, image) {
      const noFileMessage = 'Please upload a file';
      const wrongFileTypeMessage = 'Please upload an image file';

      if (!file) return noFileMessage;
      else if (!image) return wrongFileTypeMessage;
    },
    emitAction(name) {
      actions.$emit(name);
    }
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
