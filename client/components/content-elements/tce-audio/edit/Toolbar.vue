<template>
  <div class="tce-audio-toolbar">
    <input
      v-model="url"
      :disabled="!edit"
      class="form-control"
      type="text"
      placeholder="URL">
    <button
      v-if="edit"
      @click="save"
      class="btn btn-success"
      type="button">
      Save
    </button>
    <button
      v-else
      @click="edit = true"
      class="btn btn-default"
      type="button">
      Edit
    </button>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';

export default {
  name: 'tce-audio-toolbar',
  props: {
    element: { type: Object, required: true }
  },
  data() {
    return {
      url: '',
      edit: !this.element.data.url,
      ...cloneDeep(this.element.data)
    };
  },
  methods: {
    save() {
      this.edit = false;
      const element = cloneDeep(this.element);
      element.data.url = this.url;
      this.$emit('save', element);
    }
  }
};
</script>

<style lang="scss" scoped>
.tce-audio-toolbar {
  position: relative;
  z-index: 999;
  width: 100%;
  height: 60px;
  padding: 13px 45px 0;

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
