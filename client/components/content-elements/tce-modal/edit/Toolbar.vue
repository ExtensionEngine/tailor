<template>
  <v-toolbar
    height="72"
    color="transparent"
    class="tce-modal-toolbar elevation-0">
    <v-toolbar-title class="pl-1">Modal component</v-toolbar-title>
    <v-toolbar-items class="mx-auto">
      <v-text-field
        v-model="title"
        label="Button label"
        placeholder="Button label..."
        prepend-icon="mdi-gesture-tap-button"
        filled dense hide-details
        class="mt-2 mr-5" />
      <v-btn @click="toggleEdit" text>Toggle Edit Mode</v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';

export default {
  inject: ['$elementBus'],
  props: {
    element: { type: Object, required: true }
  },
  data() {
    return {
      title: this.element.data.title
    };
  },
  methods: {
    toggleEdit() {
      this.$elementBus.emit('toggleEdit');
    }
  },
  watch: {
    title: debounce(function () {
      const data = cloneDeep(this.element.data);
      data.title = this.title;
      this.$elementBus.emit('save', data);
    }, 500)
  }
};
</script>

<style lang="scss" scoped>
.v-toolbar__title {
  min-width: 23.875rem;
  text-align: left;
}

.v-text-field {
  min-width: 22.5rem;
}
</style>
