<template>
  <div class="brightcove-video-toolbar">
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
import { mapActions } from 'vuex-module';
import pick from 'lodash/pick';

const props = ['accountId', 'playerId', 'videoId'];

export default {
  props: ['element'],
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
    ...mapActions({ updateElement: 'update' }, 'tes'),
    save() {
      this.edit = false;
      let element = cloneDeep(this.element);
      element.data = Object.assign({}, element.data, pick(this, props));
      this.updateElement(element);
    }
  }
};
</script>

<style lang="scss" scoped>
.brightcove-video-toolbar {
  position: relative;
  z-index: 999;
  width: 100%;
  height: 60px;
  padding: 13px 45px 0 45px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,.34);
}

.input-group {
  display: block;
  width: 100%;
  float: left;
  padding-right: 200px;
  margin-right: -200px;
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
