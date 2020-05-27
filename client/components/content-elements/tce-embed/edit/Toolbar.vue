<template>
  <v-toolbar
    height="72"
    color="transparent"
    class="tce-embed-toolbar elevation-0">
    <v-toolbar-title class="pl-1">Embed component</v-toolbar-title>
    <div class="input-container">
      <v-text-field
        v-model="height"
        @input="onChange"
        type="number"
        name="height"
        label="Height (px)"
        placeholder="Height..."
        prepend-icon="mdi-resize"
        hide-details dense filled
        class="height-input" />
      <validation-provider
        ref="url"
        v-slot="{ errors }"
        name="url"
        :rules="{ regex: /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/ }">
        <v-text-field
          v-model="url"
          @input="onChange"
          :error-messages="errors"
          name="url"
          label="URL"
          placeholder="Enter URL..."
          prepend-icon="mdi-link"
          data-vv-delay="0"
          hide-details dense filled />
          </validation-provider>
    </div>
  </v-toolbar>
</template>

<script>
import debounce from 'lodash/debounce';

export default {
  name: 'tce-embed-toolbar',
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
      const { valid } = await this.$refs.url.validate();
      if (!valid) return;
      this.save({ height, url });
    },
    save: debounce(function (data) {
      this.$elementBus.emit('save', data);
    }, 700)
  }
};
</script>

<style lang="scss" scoped>
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
