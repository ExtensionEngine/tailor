<template>
  <v-toolbar height="72" color="transparent" class="elevation-0">
    <v-toolbar-title class="pl-1">Carousel toolbar</v-toolbar-title>
    <v-toolbar-items class="mx-auto">
      <v-btn @click="add" text>
        <v-icon class="pr-2">mdi-plus</v-icon> Add slide
      </v-btn>
      <v-btn @click="remove" text>
        <v-icon class="pr-2">mdi-minus</v-icon> Remove current slide
      </v-btn>
      <validation-provider
        ref="height"
        v-slot="{ errors }"
        name="height"
        rules="required|min_value:200|max_value:3000">
        <v-text-field
          v-model="height"
          :error-messages="errors"
          name="height"
          label="Height (px)"
          placeholder="Height..."
          prepend-icon="mdi-resize"
          hide-details filled dense
          class="mt-2 ml-5" />
      </validation-provider>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import debounce from 'lodash/debounce';

export default {
  name: 'tce-carousel-toolbar',
  inject: ['$elementBus'],
  props: {
    element: { type: Object, required: true }
  },
  data: vm => ({ height: vm.element.data.height || 500 }),
  methods: {
    add() {
      this.$elementBus.emit('add');
    },
    remove() {
      this.$elementBus.emit('remove');
    }
  },
  watch: {
    height: debounce(async function () {
      const { valid } = await this.$refs.height.validate();
      if (valid) this.$elementBus.emit('height', this.height);
    }, 2000)
  }
};
</script>

<style lang="scss" scoped>
.v-toolbar__title {
  min-width: 23.875rem;
  text-align: left;
}
</style>
