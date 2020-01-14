import downloadMixin from 'utils/downloadMixin';
import EventBus from 'EventBus';

const appChannel = EventBus.channel('app');

export default {
  inject: ['$storageService'],
  mixins: [downloadMixin],
  data: () => ({ uploading: false }),
  methods: {
    createFileForm(e) {
      this.form = new FormData();
      const [file] = e.target.files;
      if (!file) return;
      this.form.append('file', file, file.name);
    },
    upload(e) {
      this.createFileForm(e);
      this.uploading = true;
      return this.$storageService.upload(this.form)
        .then(({ url, publicUrl, key }) => {
          this.uploading = false;
          const { name } = this.form.get('file');
          this.$emit('upload', { url, publicUrl, key, name });
        }).catch(() => {
          this.error = 'An error has occurred!';
        });
    },
    async downloadFile(key, name) {
      const url = await this.$storageService.getUrl(key);
      return this.download(url, name);
    },
    deleteFile(item) {
      appChannel.emit('showConfirmationModal', {
        title: 'Delete file?',
        message: `Are you sure you want to remove ${item.fileName}?`,
        action: () => this.$emit('delete', item.id, null)
      });
    }
  }
};
