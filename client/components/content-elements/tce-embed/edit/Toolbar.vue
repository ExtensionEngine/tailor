<template>
  <div class="tce-embed-toolbar">
    <v-text-field
      v-model="height"
      v-validate="{ required: true, numeric: true, min_value: 50, max_value: 3000 }"
      @input="onChange"
      id="heightInput"
      data-vv-delay="0"
      hide-details
      single-line
      prepend-icon="mdi-arrow-expand"
      class="height"
      name="height"
      label="Height" />
    <span v-show="vErrors.has('height')" class="error-messages">
      {{ vErrors.first('height') }}
    </span>
    <v-text-field
      v-model="url"
      v-validate="{ required: true, url: true }"
      @input="onChange"
      id="urlInput"
      data-vv-delay="0"
      hide-details
      single-line
      prepend-icon="mdi-link-variant"
      class="url"
      name="url"
      label="Url" />
    <span v-show="vErrors.has('url')" class="error-messages">
      {{ vErrors.first('url') }}
    </span>
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
  display: flex;
  align-items: center;
  width: 100%;
  height: 48px;
  padding: 0 30px 0 10px;

  .v-input {
    margin-top: 0;
    padding: 0;

    &.height {
      max-width: 150px;
    }

    &.url {
      max-width: 275px;
      margin-left: 8px;
    }
  }

  .error-messages {
    margin-left: 8px;
    color: #ff5252;
    font-size: 14px;
    font-weight: normal;
  }
}
</style>
