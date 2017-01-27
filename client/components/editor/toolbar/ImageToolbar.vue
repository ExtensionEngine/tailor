<template>
  <div class="image-toolbar">
    <div class="col-md-4 actions">
      <ul v-show="isUploaded">
        <li>
          <button @click="emitAction(action.reset)" class="btn btn-link">Reset</button>
        </li>
        <li>
          <button @click="removeImage" class="btn btn-link">Remove</button>
        </li>
        <li>
          <button
            @click="emitAction(action.crop)"
            class="btn btn-link"
            title="Crop">
              <span class="fa fa-crop fa-lg"></span>
          </button>
        </li>
        <li>
          <button
            @click="emitAction(action.rotateLeft)"
            class="btn btn-link"
            title="Rotate Left">
              <span class="fa fa-rotate-left fa-lg"></span>
          </button>
        </li>
        <li>
          <button
            @click="emitAction(action.rotateRight)"
            class="btn btn-link"
            title="Rotate Right">
              <span class="fa fa-rotate-right fa-lg"></span>
          </button>
        </li>
      </ul>
    </div>

    <div class="col-md-4 file-upload">
      <div class="col-md-2 file-input">
        <label>
          <input @change="saveImage" type="file" />
          <span class="fa fa-upload fa-2x"></span>
        </label>
      </div>
      <div class="col-md-10 file-text" :class="errorClass">
        <input type="text" :value="asset.name" disabled readonly />
        <div v-show="error" class="error-message">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { isEmpty, map, zipObject } from 'lodash';
import actions from './toolbarActions';

// TODO(marko): URL image upload. Multiple image assets. Image name?
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
      const events = ['crop', 'reset', 'upload', 'rotateLeft', 'rotateRight'];
      const namespaceEvent = name => `${name}/${this.asset._cid}`;
      return zipObject(events, map(events, e => namespaceEvent(e)));
    },
    errorClass() {
      return { 'has-error': this.error };
    },
    isUploaded() {
      return this.asset.file && !isEmpty(this.asset.file);
    }
  },
  methods: {
    saveImage(event) {
      this.error = null;
      const noFileMessage = 'Please upload a file';
      const wrongFileTypeMessage = 'Please upload an image file';

      // Validation
      const input = event.target;
      const file = !isEmpty(input.files) ? input.files[0] : null;
      const image = file && file.type.match('image.*') ? file : null;

      // Set error message if validation fails
      if (!file) this.error = noFileMessage;
      else if (!image) this.error = wrongFileTypeMessage;

      // Create image file and pass it to the Image component
      if (!this.error) {
        const reader = new window.FileReader();
        reader.onload = (e) => {
          const file = e.target.result;
          const name = image.name;
          this.setImage({ file, name });
        };
        reader.readAsDataURL(input.files[0]);
      }
    },
    removeImage() {
      this.setImage({ file: '', name: '' });
    },
    setImage(data) {
      actions.$emit(this.action.upload, data);
    },
    emitAction(name) {
      actions.$emit(name);
    }
  }
};
</script>

<style lang="scss">
.image-toolbar {
  position: fixed;
  z-index: 999;
  width: 100%;
  height: 60px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.34);

  .actions {
    padding: 12px 10px;
    text-align: left;

    ul {
      padding: 0;

      li {
        display: inline-block;
        margin: 0 2px;
      }
    }
  }
}

.file-upload {
  .file-input {
    overflow: hidden;
    padding: 15px 0;
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
    padding: 20px 5px;

    input[type="text"] {
      border-bottom: 1px solid #b3b3b3;
      width: 100%;
    }

    .error-message {
      color: darken(#d9534f, 15%);
      font-size: 14px;
      font-weight: 500;
      padding: 1px 0;
      text-align: left;
    }
  }
}
</style>
