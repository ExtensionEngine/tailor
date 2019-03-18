<template>
  <div class="tce-pdf-toolbar">
    <div v-if="url && !editing" class="new-window">
      <a :href="signedUrl || url" target="_blank">
        <span class="mdi mdi-open-in-new"></span>
      </a>
    </div>
    <file-upload
      v-if="!url || editing"
      :fileKey="fileName ? url : null"
      :validate="{ ext: 'PDF' }"
      @upload="setFile"
      @delete="setFile"/>
    <input
      ref="input"
      :value="fileName || url"
      :disabled="!editing"
      @input="editUrl"
      class="form-control"
      type="text"
      placeholder="...or paste a URL">
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
import FileUpload from '@/components/common/FileUpload';
import pick from 'lodash/pick';

export default {
  name: 'tce-pdf-toolbar',
  inject: ['$storageService'],
  props: {
    element: { type: Object, required: true }
  },
  data() {
    return {
      editing: !this.element.data.url,
      url: '',
      signedUrl: null,
      ...cloneDeep(this.element.data)
    };
  },
  computed: {
    hasChanges() {
      const { url, element: { data } } = this;
      return url && data.url !== url;
    }
  },
  methods: {
    save() {
      this.editing = false;
      const element = cloneDeep(this.element);
      Object.assign(element.data, pick(this, ['url', 'fileName']));
      this.$emit('save', element);
    },
    setFile({ key, name }) {
      this.url = key || null;
      this.fileName = name || null;
    },
    editUrl() {
      this.fileName = null;
      this.url = this.$refs.input.value.trim();
    }
  },
  watch: {
    url: {
      immediate: true,
      handler: function (val) {
        if (!this.fileName) return (this.signedUrl = null);
        this.$storageService.getUrl(val).then(url => (this.signedUrl = url));
      }
    }
  },
  components: { FileUpload }
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

    a {
      color: #444;

      &:hover {
        color: #42b983;
      }
    }
  }

  /deep/ .help-block {
    display: none;
  }
}
</style>
