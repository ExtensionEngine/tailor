<template>
  <div class="tce-modal-toolbar">
    <v-btn @click="toggleEdit" text tile>
      <v-icon small left>mdi-pencil</v-icon>Toggle Edit
    </v-btn>
    <v-text-field
      v-model="title"
      id="titleInput"
      label="Title"
      hide-details
      single-line />
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
      const element = cloneDeep(this.element);
      element.data.title = this.title;
      this.$emit('save', element);
    }, 500)
  }
};
</script>

<style lang="scss" scoped>
.tce-modal-toolbar {
  display: flex;
  position: relative;
  width: 100%;
  height: 50px;
  align-items: center;
  padding: 0 30px 0 10px;

  .v-btn {
    height: 100%;
  }

  .v-text-field {
    max-width: 150px;
    margin-top: 0;
    margin-left: 8px;
    padding: 0;
  }
}
</style>
