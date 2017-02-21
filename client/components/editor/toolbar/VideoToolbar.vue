<template>
  <div class="video-toolbar">
    <input
      v-model="url"
      :disabled="!edit"
      type="text"
      class="form-control"
      placeholder="URL">
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

const regex = { youtube: /youtu\.?be/, vimeo: /vimeo/ };
const types = { youtube: 'video/youtube', vimeo: 'video/vimeo' };

export default {
  name: 'video-toolbar',
  props: ['asset', 'isFocused'],
  data() {
    return {
      edit: !this.asset.data.url,
      url: '',
      ...cloneDeep(this.asset)
    };
  },
  methods: {
    ...mapActions({ updateAsset: 'update' }, 'assets'),
    save() {
      this.edit = false;
      this.updateAsset({ ...this.asset, data: this.getVideoData() });
    },
    getVideoData() {
      let type = '';
      const url = this.url;

      if (url.match(regex.youtube)) type = types.youtube;
      else if (url.match(regex.vimeo)) type = types.vimeo;

      return { type, url };
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
