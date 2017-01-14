<template>
  <div @click="onClick">
    <quill-toolbar></quill-toolbar>
  </div>
</template>

<script>
import QuillToolbar from './QuillToolbar';

export default {
  name: 'toolbar',
  methods: {
    onClick(e) {
      e.component = {
        name: 'toolbar',
        data: {}
      };
    }
  },
  components: {
    QuillToolbar
  }
};
</script>
