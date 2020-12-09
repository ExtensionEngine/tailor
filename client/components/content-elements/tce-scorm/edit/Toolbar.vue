<template>
  <v-toolbar
    height="72"
    color="transparent"
    class="tce-scorm-toolbar elevation-0">
    <v-toolbar-title class="pl-1">SCORM toolbar</v-toolbar-title>
    <v-toolbar-items class="mx-auto">
      <upload-btn @upload="saveElement" label="Upload SCORM package" unpack />
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import UploadBtn from 'tce-core/UploadBtn';

export default {
  props: {
    element: { type: Object, required: true }
  },
  computed: {
    isUploaded: vm => Boolean(vm.element.data.launchUrl)
  },
  methods: {
    saveElement(data) {
      const element = cloneDeep(this.element);
      Object.assign(element.data, data);
      this.$emit('save', element);
    }
  },
  components: { UploadBtn }
};
</script>

<style lang="scss" scoped>
.tce-scorm-toolbar ::v-deep {
  .v-toolbar__title {
    min-width: 23.875rem;
    text-align: left;
  }

  .file-upload {
    display: flex;
    align-items: center;
  }
}
</style>
