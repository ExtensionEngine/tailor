<template>
  <v-toolbar height="72" color="transparent" class="elevation-0">
    <v-toolbar-title>Carousel toolbar</v-toolbar-title>
    <v-toolbar-items class="mx-auto">
      <v-btn @click="add" text>
        <v-icon class="pr-2">mdi-plus</v-icon> Add slide
      </v-btn>
      <v-btn @click="remove" text>
        <v-icon class="pr-2">mdi-minus</v-icon> Remove current slide
      </v-btn>
      <v-text-field
        v-model="height"
        v-validate="'required|min_value:200|max_value:3000'"
        :error-messages="vErrors.collect('height')"
        name="height"
        label="Height (px)"
        placeholder="Height..."
        prepend-icon="mdi-resize"
        hide-details filled dense
        class="mt-2 ml-5" />
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import debounce from 'lodash/debounce';
import { withValidation } from 'utils/validation';

export default {
  name: 'tce-carousel-toolbar',
  inject: ['$elementBus'],
  mixins: [withValidation()],
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
    height: debounce(function () {
      if (!this.vErrors.has('height')) {
        this.$elementBus.emit('height', this.height);
      }
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
