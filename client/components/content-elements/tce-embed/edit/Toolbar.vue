<template>
  <v-toolbar
    height="68"
    color="transparent"
    class="tce-embed-toolbar elevation-0">
    <v-toolbar-title>Embed component</v-toolbar-title>
    <div class="input-container">
      <v-text-field
        v-model="height"
        @input="onChange"
        name="height"
        type="number"
        label="Height (px)"
        placeholder="Height..."
        prepend-icon="mdi-resize"
        hide-details dense filled
        class="height-input" />
      <v-text-field
        v-model="url"
        v-validate="{ url: true }"
        @input="onChange"
        :error-messages="vErrors.collect('url')"
        name="url"
        label="URL"
        placeholder="Enter URL..."
        prepend-icon="mdi-link"
        data-vv-delay="0"
        hide-details dense filled />
    </div>
  </v-toolbar>
</template>

<script>
import debounce from 'lodash/debounce';
import { withValidation } from 'utils/validation';

export default {
  name: 'tce-embed-toolbar',
  mixins: [withValidation()],
  inject: ['$elementBus'],
  props: {
    element: { type: Object, required: true }
  },
  data() {
    const { height, url } = this.element.data;
    return { height, url };
  },
  methods: {
    async onChange() {
      const { height, url } = this;
      const isValid = await this.$validator.validateAll();
      if (!isValid) return;
      this.save({ height, url });
    },
    save: debounce(function (data) {
      this.$elementBus.emit('save', data);
    }, 700)
  }
};
</script>

<style lang="scss" scoped>
.tce-embed-toolbar {
  position: relative;
  width: 100%;
}

.v-toolbar__title {
  min-width: 23.875rem;
  text-align: left;
}

.input-container {
  display: flex;
  flex: 1;
  justify-content: center;
  padding-right: 2.5rem;
}

.v-input {
  max-width: 37.5rem;
}

.v-input.height-input {
  max-width: 10rem;
  margin-right: 1.25rem;
}
</style>
