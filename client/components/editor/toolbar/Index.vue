<template>
  <div @click="onClick">
    <quill-toolbar v-if="showTextToolbar"></quill-toolbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex-module';
import QuillToolbar from './QuillToolbar';

export default {
  name: 'toolbar',
  computed: {
    ...mapGetters(['focusedAsset'], 'atom'),
    showTextToolbar() {
      return this.focusedAsset && (this.focusedAsset.type === 'text');
    }
  },
  methods: {
    onClick(e) {
      // Attach component data
      e.component = { name: 'toolbar', data: {} };
    }
  },
  components: {
    QuillToolbar
  }
};
</script>
