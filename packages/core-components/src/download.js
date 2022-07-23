export default {
  methods: {
    download(url, fileName) {
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.target = '_blank';
      a.click();
    }
  }
};
