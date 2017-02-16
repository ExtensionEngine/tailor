<template>
  <div class="gomo-toolbar">
    <input
      v-model="courseUrl"
      :disabled="!edit"
      type="text"
      class="form-control"
      placeholder="Gomo course url">
    <button
      v-if="!edit"
      @click="edit = true"
      type="button"
      class="btn btn-default">
      Edit
    </button>
    <button
      v-if="edit"
      type="button"
      class="btn btn-success"
      @click="save">
      Save
    </button>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import { mapActions } from 'vuex-module';

export default {
  name: 'gomo-toolbar',
  props: ['asset', 'isFocused'],
  data() {
    return {
      edit: !this.asset.data.courseUrl,
      courseUrl: '',
      ...cloneDeep(this.asset.data)
    };
  },
  methods: {
    ...mapActions({ updateAsset: 'update' }, 'assets'),
    save() {
      this.edit = false;
      this.updateAsset({ ...this.asset, data: { courseUrl: this.courseUrl } });
    }
  }
};
</script>

<style lang="scss" scoped>
.gomo-toolbar {
  position: relative;
  z-index: 999;
  width: 100%;
  height: 60px;
  padding: 13px 45px 0 45px;
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
