<template>
  <div class="tce-brightcove-toolbar">
    <div class="input-group">
      <div class="row">
        <div class="col-xs-4">
          <input
            v-model="accountId"
            :disabled="!edit"
            class="form-control"
            type="text"
            placeholder="Account Id">
        </div>
        <div class="col-xs-4">
          <input
            v-model="playerId"
            :disabled="!edit"
            class="form-control"
            type="text"
            placeholder="Player Id">
        </div>
        <div class="col-xs-4">
          <input
            v-model="videoId"
            :disabled="!edit"
            class="form-control"
            type="text"
            placeholder="Video Id">
        </div>
      </div>
    </div>
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
import isEmpty from 'lodash/isEmpty';
import pick from 'lodash/pick';

const props = ['accountId', 'playerId', 'videoId'];

export default {
  name: 'tce-brightcove-toolbar',
  props: {
    element: { type: Object, required: true }
  },
  data() {
    return {
      edit: isEmpty(pick(this.element.data, props)),
      accountId: '',
      playerId: '',
      videoId: '',
      ...cloneDeep(this.element.data)
    };
  },
  methods: {
    save() {
      this.edit = false;
      const element = cloneDeep(this.element);
      Object.assign(element.data, pick(this, props));
      this.$emit('save', element);
    }
  }
};
</script>

<style lang="scss" scoped>
.tce-brightcove-toolbar {
  position: relative;
  z-index: 999;
  width: 100%;
  height: 60px;
  padding: 13px 45px 0;
}

.input-group {
  display: block;
  width: 100%;
  float: left;
  margin-right: -200px;
  padding-right: 200px;
}

.form-control {
  padding: 0 7px;
  background: transparent;
}

.btn {
  position: relative;
  z-index: 1;
  padding: 6px 15px;
  font-size: 11px;

  &:active {
    outline: none;
  }
}
</style>
