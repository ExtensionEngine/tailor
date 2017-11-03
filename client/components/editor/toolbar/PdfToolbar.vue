<template>
  <div class="pdf-toolbar">
    <input
      v-model="url"
      :disabled="!editing"
      class="form-control"
      type="text"
      placeholder="URL">
    <button
      v-if="!editing"
      @click="editing = true"
      class="btn btn-default"
      type="button">
      Edit
    </button>
    <button
      v-else
      @click="save"
      class="btn btn-success"
      type="button">
      Save
    </button>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import { mapActions } from 'vuex-module';

export default {
  name: 'pdf-toolbar',
  props: {
    element: { type: Object, required: true }
  },
  data() {
    return {
      editing: !this.element.data.url,
      url: '',
      ...cloneDeep(this.element.data)
    };
  },
  methods: {
    ...mapActions({ updateElement: 'update' }, 'tes'),
    save() {
      this.editing = false;
      let element = cloneDeep(this.element);
      element.data.url = this.url;
      this.updateElement(element);
    }
  }
};
</script>

<style lang="scss" scoped>
.pdf-toolbar {
  position: relative;
  width: 100%;
  height: 60px;
  padding: 13px 45px 0;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.34);
  z-index: 999;

  .form-control {
    display: inline-block;
    max-width: 600px;
    margin: 0 20px;
    padding: 0 7px;
  }

  .btn {
    padding: 6px 15px;
    font-size: 11px;

    &:active {
      outline: none;
    }
  }
}
</style>
