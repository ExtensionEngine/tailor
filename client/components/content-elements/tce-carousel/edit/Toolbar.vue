<template>
  <div class="toolbar-container">
    <div class="navigation-sidebar">
    </div>
    <div class="carousel-action">
      <v-btn @click="add" text>
        <v-icon small>mdi-plus</v-icon>
        Add slide
      </v-btn>
      <v-btn @click="remove" text>
        <v-icon small>mdi-minus</v-icon>
        Remove slide
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
  data() {
    return {
      height: this.element.data.height || 500
    };
  },
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
.toolbar-container {
  display: flex;
  flex-wrap: wrap;

  .navigation-sidebar {
    display: flex;
    width: 25rem;
  }

  .carousel-action {
    display: flex;
    flex-grow: 1;
    justify-content: center;
    align-items: center;

    .v-btn {
      width: 7.5rem;
      margin-right: 1rem;
    }

    .v-input {
      max-width: 7.5rem;
      margin-left: 0.625rem;
    }
  }
}
</style>
