<template>
  <v-toolbar
    height="72"
    color="transparent"
    class="tce-embed-toolbar elevation-0">
    <v-toolbar-title class="pl-1">Embed component</v-toolbar-title>
    <div class="input-container mt-5">
      <validation-observer ref="form" tag="form" class="d-flex">
        <validation-provider
          v-slot="{ errors }"
          name="height"
          rules="required|min_value:200|max_value:3000"
          slim>
          <v-text-field
            v-model="height"
            @keyup="onChange"
            :error-messages="errors"
            type="number"
            name="height"
            label="Height (px)"
            placeholder="Height..."
            prepend-icon="mdi-resize"
            dense filled
            class="required height-input" />
        </validation-provider>
        <validation-provider
          v-slot="{ errors }"
          name="url"
          :rules="{
            url: {
              protocols: ['http', 'https'],
              require_protocol: true,
              require_valid_protocol: true
            }
          }"
          slim>
          <v-text-field
            v-model="url"
            @keyup="onChange"
            :error-messages="errors"
            name="url"
            label="URL"
            placeholder="Enter URL..."
            prepend-icon="mdi-link"
            dense filled />
        </validation-provider>
      </validation-observer>
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
      const valid = await this.$refs.form.validate();
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
  max-width: 14rem;
  margin-right: 1.25rem;
}
</style>
