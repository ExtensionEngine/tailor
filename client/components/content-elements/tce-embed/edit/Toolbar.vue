<template>
  <div class="tce-embed-toolbar">
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
          v-validate="{ required: true, numeric: true, min_value: 50, max_value: 3000 }"
          @input="onChange"
          id="heightInput"
          data-vv-delay="0"
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
          v-validate="{ required: true, url: true }"
          @input="onChange"
          id="urlInput"
          data-vv-delay="0"
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
import debounce from 'lodash/debounce';

export default {
  name: 'tce-embed-toolbar',
  inject: ['$validator', '$elementBus'],
  props: {
    element: { type: Object, required: true }
  },
  data() {
    const { height, url } = this.element.data;
    return { height, url };
  },
  methods: {
    onChange() {
      const { height, url } = this;
      this.$validator.validateAll().then(isValid => {
        if (!isValid) return;
        this.save({ height, url });
      });
    },
    save: debounce(function (data) {
      this.$elementBus.emit('save', data);
    }, 700)
  }
};
</script>

<style lang="scss" scoped>
.tce-embed-toolbar {
  width: 100%;
  height: 48px;
  padding: 0 30px 0 10px;
  line-height: 48px;
  text-align: left;
  vertical-align: middle;

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
