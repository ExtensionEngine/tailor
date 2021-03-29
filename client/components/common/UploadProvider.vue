<template>
  <div>
    <slot v-bind="{ uploading, uploadFile, downloadFile, deleteFile }"></slot>
  </div>
</template>

<script>
import downloadMixin from 'utils/downloadMixin';
import loader from '@/components/common/loader';
import { mapRequests } from '@/plugins/radio';

export default {
  inject: ['$storageService'],
  mixins: [downloadMixin],
  props: {
    repositoryId: { type: Number, default: null }
  },
  data: () => ({ uploading: false }),
  methods: {
    ...mapRequests('app', ['showConfirmationModal']),
    createFileForm(e) {
      this.form = new FormData();
      const [file] = e.target.files;
      if (!file) return;
      this.form.append('file', file, file.name);
    },
    upload(data) {
      if (!this.repositoryId) return this.storageService.upload(data);
      return this.$storageService.uploadRepositoryAsset(this.repositoryId, data);
    },
    uploadFile: loader(function (e) {
      this.createFileForm(e);
      return this.upload(this.form)
        .then(data => {
          const { name } = this.form.get('file');
          this.$emit('upload', { ...data, name });
        }).catch(() => {
          this.error = 'An error has occurred!';
        });
    }, 'uploading'),
    async downloadFile(key, name) {
      const url = this.repositoryId
        ? await this.$storageService.getRepositoryAssetUrl(this.repositoryId, key)
        : await this.$storageService.getUrl(key);
      return this.download(url, name);
    },
    deleteFile(item) {
      this.showConfirmationModal({
        title: 'Delete file?',
        message: `Are you sure you want to remove ${item.fileName}?`,
        action: () => this.$emit('delete', item.id, null)
      });
    }
  },
  watch: {
    uploading(val) {
      this.$emit('uploading', val);
    }
  }
};
</script>;
