<template>
  <div class="d-flex align-center">
    <v-btn @click="add" icon small>
      <v-icon small>mdi-plus</v-icon>
      Add item
    </v-btn>
    <v-btn @click="remove" icon small>
      <v-icon small>mdi-minus</v-icon>
      Remove item
    </v-btn>
    <v-text-field
      v-model="height"
      v-validate="'required|min_value:300|max_value:3000'"
      :error-messages="vErrors.collect('height')"
      name="height"
      label="Height"
      hide-details solo>
      <v-icon slot="prepend-inner" class="mr-2" small>mdi-arrow-expand</v-icon>
    </v-text-field>
    <div v-show="vErrors.has('height')" class="d-flex pl-3">
      {{ vErrors.first('height') }}
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';

export default {
  name: 'tce-carousel-toolbar',
  inject: ['$elementBus', '$validator'],
  props: {
    element: { type: Object, required: true }
  },
  data: () => ({ height: this.element.data.height || 500 }),
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
.v-btn {
  width: 6.875rem;
  margin-right: 1rem;
}

.v-input {
  max-width: 7.5rem;
  margin-left: 0.625rem;
}
</style>
