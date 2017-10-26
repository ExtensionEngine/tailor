<template>
  <div class="embed-toolbar">
    <div class="toolbar-item">
      <label for="heightInput">
        <span class="mdi mdi-arrow-expand"></span>
        Height
      </label>
      <span
        :class="{ 'has-error': vErrors.has('height') }"
        class="input">
        <input
          v-model="height"
          v-validate="{
            rules: {
              required: true, numeric: true, min_value: 300, max_value: 3000
            }
          }"
          @input="onChange"
          data-vv-delay="0"
          id="heightInput"
          class="form-control"
          name="height"
          type="text"
          placeholder="Height">
      </span>
      <span v-show="vErrors.has('height')" class="help-block">
        {{ vErrors.first('height') }}
      </span>
    </div>
    <div class="toolbar-item">
      <label for="urlInput">
        <span class="mdi mdi-link"></span>
        URL
      </label>
      <span :class="{ 'has-error': vErrors.has('url') }" class="input url">
        <input
          v-model="url"
          v-validate="{ rules: { required: true, url: true } }"
          @input="onChange"
          data-vv-delay="0"
          id="urlInput"
          class="form-control"
          name="url"
          type="text"
          placeholder="Url">
      </span>
      <span v-show="vErrors.has('url')" class="help-block">
        {{ vErrors.first('url') }}
      </span>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import { mapActions } from 'vuex-module';

export default {
  name: 'embed-toolbar',
  props: ['element'],
  data() {
    const { height, url } = this.element.data;
    return {
      height,
      url
    };
  },
  methods: {
    ...mapActions({ updateElement: 'update' }, 'tes'),
    onChange() {
      const { height, url } = this;
      this.$validator.validateAll().then(isValid => {
        if (!isValid) return;
        const element = cloneDeep(this.element);
        const data = { ...element.data, height, url };
        this.save({ ...this.element, data });
      });
    },
    save: debounce(function (element) {
      this.updateElement(element);
    }, 700)
  },
  inject: ['$validator']
};
</script>

<style lang="scss" scoped>
.embed-toolbar {
  width: 100%;
  height: 48px;
  padding: 0 30px 0 10px;
  line-height: 48px;
  text-align: left;
  vertical-align: middle;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.34);

  .toolbar-item {
    display: inline-block;
    color: #444;

    label, .input {
      display: inline-block;
    }

    label {
      padding: 0 10px;
      font-size: 12px;
      line-height: 12px;
      font-family: 'Catamaran', Helvetica, Arial, sans-serif;
      text-transform: uppercase;
    }

    input {
      height: 25px;
      margin: 0;
      padding: 0;
      font-size: 14px;
      line-height: 14px;
    }

    .url {
      width: 256px;
    }

    .help-block {
      display: inline-block;
      margin: 0;
      padding-left: 10px;
    }

    .mdi {
      display: inline-block;
      margin-right: 5px;
      font-size: 20px;
      line-height: 20px;
      vertical-align: middle;
    }
  }

  .toolbar-item + .toolbar-item {
    margin-left: 8px;
  }
}
</style>
