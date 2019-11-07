<template>
  <div class="tce-file">
    <v-btn
      v-if="url || loading"
      @click="downloadFile"
      :disabled="loading"
      :loading="loading"
      color="primary"
      class="file-button">
      <v-icon>mdi mdi-file-download</v-icon> {{ label || filename }}
    </v-btn>
    <div v-else>
      <div class="well">
        <div class="message">
          <h3 class="heading">File placeholder</h3>
          <span v-if="!isFocused">Select to edit</span>
          <span v-else>Please use toolbar to upload file</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import downloadMixin from 'utils/downloadMixin';
import get from 'lodash/get';
import pick from 'lodash/pick';
import Promise from 'bluebird';

export default {
  name: 'tce-file',
  mixins: [downloadMixin],
  inject: ['$elementBus', '$storageService'],
  props: {
    element: { type: Object, required: true },
    isFocused: { type: Boolean, default: false }
  },
  data: () => ({
    loading: false
  }),
  computed: {
    filename() {
      return get(this.element, 'data.name');
    },
    url() {
      return get(this.element, 'data.url');
    },
    label() {
      return get(this.element, 'data.label');
    }
  },
  methods: {
    uploadFile(formData) {
      this.loading = true;
      const { upload } = this.$storageService;
      return Promise.join(upload(formData), Promise.delay(600))
        .spread(res => {
          const { url, name } = pick(res, ['url', 'name']);
          return { assets: { url }, name };
        })
        .then(data => this.$emit('save', data))
        .finally(() => (this.loading = false));
    },
    downloadFile() {
      this.loading = true;
      const { download, filename, url } = this;
      return Promise.join(download(url, filename), Promise.delay(600))
        .finally(() => (this.loading = false));
    }
  },
  mounted() {
    this.$elementBus.on('upload', this.uploadFile);
    this.$elementBus.on('update:label', label => {
      const { assets } = this.element.data;
      this.$emit('save', { label, assets, url: null });
    });
  }
};
</script>

<style lang="scss" scoped>
.tce-file {
  .file-button {
    text-transform: none;

    .mdi-file-download {
      padding-right: 5px;
    }
  }

  .well {
    margin: 0;
  }

  .message {
    padding: 30px 0;
    font-size: 18px;

    .heading {
      font-weight: 400;
    }
  }
}
</style>
