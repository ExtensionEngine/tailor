<template>
  <div class="modal-toolbar-container">
    <div class="navigation-sidebar">
    </div>
    <div class="modal-action">
      <v-btn @click="toggleEdit" text>
        <v-icon small>mdi-pencil-outline</v-icon>
        Toggle edit
      </v-btn>
      <v-text-field
        v-model="title"
        label="Title"
        hide-details solo>
        <v-icon slot="prepend-inner" class="mr-2" small>mdi-format-title</v-icon>
      </v-text-field>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';

export default {
  inject: ['$elementBus'],
  props: {
    element: { type: Object, required: true }
  },
  data: vm => ({ title: vm.element.data.title }),
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
.modal-toolbar-container {
  display: flex;
  flex-wrap: wrap;

  .navigation-sidebar {
    display: flex;
    width: 25rem;
  }

  .modal-action {
    display: flex;
    flex-grow: 1;
    justify-content: center;
    align-items: center;

    .v-input {
      max-width: 12.5rem;
      margin-left: 0.625rem;
    }
  }
}
</style>
