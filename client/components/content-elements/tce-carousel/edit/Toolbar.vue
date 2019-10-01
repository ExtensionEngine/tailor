<template>
  <div class="tce-carousel-toolbar">
    <v-btn @click="add" tile text>
      <v-icon small left>mdi-plus</v-icon>
      Add item
    </v-btn>
    <v-btn @click="remove" tile text>
      <v-icon small left>mdi-minus</v-icon>
      Remove item
    </v-btn>
    <v-text-field
      v-model="height"
      v-validate="{ required: true, min_value: 300, max_value: 3000 }"
      id="heightInput"
      hide-details
      single-line
      prepend-icon="mdi-arrow-expand"
      label="Height"
      name="height" />
    <span v-show="vErrors.has('height')" class="error-messages">
      {{ vErrors.first('height') }}
    </span>
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
.tce-carousel-toolbar {
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  height: 48px;
  padding: 0 30px 0 10px;

  .v-btn {
    height: 100%;
  }

  .v-input {
    max-width: 150px;
    margin-top: 0;
    margin-left: 8px;
    padding: 0;
  }

  .error-messages {
    margin-left: 8px;
    color: #ff5252;
    font-size: 14px;
    font-weight: normal;
  }
}
</style>
