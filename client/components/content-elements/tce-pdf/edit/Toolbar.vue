<template>
  <div class="tce-pdf-toolbar">
    <div :class="{ visible }" class="new-window">
      <a :href="url" target="_blank">
        <span class="mdi mdi-open-in-new"></span>
      </a>
    </div>
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
      :disabled="!hasChanges"
      @click="save"
      class="btn btn-success"
      type="button">
      Save
    </button>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';

export default {
  name: 'tce-pdf-toolbar',
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
  computed: {
    visible() {
      return !!this.url;
    },
    hasChanges() {
      const { url, element: { data } } = this;
      return url && data.url !== url.trim();
    }
  },
  methods: {
    save() {
      this.editing = false;
      const element = cloneDeep(this.element);
      element.data.url = this.url;
      this.$emit('save', element);
    }
  }
};
</script>

<style lang="scss" scoped>
.tce-pdf-toolbar {
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

  .new-window {
    display: inline-block;
    background: #fff;
    visibility: hidden;

    &.visible {
      visibility: visible;
    }

    a {
      color: #444;

      &:hover {
        color: #42b983;
      }
    }
  }
}
</style>
