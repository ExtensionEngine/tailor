<template>
  <div class="video-toolbar">
    <input
      v-model="url"
      :disabled="!edit"
      class="form-control"
      type="text"
      placeholder="URL">
    <button
      v-if="!edit"
      @click="edit = true"
      class="btn btn-default"
      type="button">
      Edit
    </button>
    <button
      v-if="edit"
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
  name: 'video-toolbar',
  props: ['element'],
  data() {
    return {
      edit: !this.element.data.url,
      url: '',
      ...cloneDeep(this.element.data)
    };
  },
  methods: {
    ...mapActions({ updateElement: 'update' }, 'tes'),
    save() {
      this.edit = false;
      let element = cloneDeep(this.element);
      element.data.url = this.url;
      this.updateElement(element);
    }
  }
};
</script>

<style lang="scss" scoped>
.video-toolbar {
  position: relative;
  z-index: 999;
  width: 100%;
  height: 60px;
  padding: 13px 45px 0;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.34);

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
