<template>
  <div @click="onClick">
    <quill-toolbar
      v-if="isVisible('TEXT')">
    </quill-toolbar>
    <video-toolbar
      v-if="isVisible('VIDEO')"
      :asset="toolbar.context">
    </video-toolbar>
    <gomo-toolbar
      v-if="isVisible('GOMO')"
      :asset="toolbar.context">
    </gomo-toolbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex-module';
import QuillToolbar from './QuillToolbar';
import VideoToolbar from './VideoToolbar';
import GomoToolbar from './GomoToolbar';

export default {
  name: 'toolbar',
  computed: {
    ...mapGetters(['toolbar'])
  },
  methods: {
    isVisible(type) {
      return this.toolbar.type === type;
    },
    onClick(e) {
      // Attach component data
      e.component = { name: 'toolbar', data: {} };
    }
  },
  components: {
    QuillToolbar,
    VideoToolbar,
    GomoToolbar
  }
};
</script>
