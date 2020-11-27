<template>
  <div class="editor-discussion">
    <discussion
      @save="saveComment"
      @update="saveComment"
      @remove="remove"
      v-bind="{ comments, user, showHeading }"
      has-all-comments show-notifications />
  </div>
</template>

<script>
import Discussion from 'tce-core/Discussion';
import utilsMixin from './common';

export default {
  name: 'editor-discussion',
  mixins: [utilsMixin],
  props: {
    activity: { type: Object, required: true },
    isVisible: { type: Boolean, default: false },
    showHeading: { type: Boolean, default: false }
  },
  watch: {
    isVisible(val) {
      if (!val || !this.lastCommentAt) return;
      this.setLastSeenComment(1000);
    },
    comments(val, oldVal) {
      if (!this.isVisible || val === oldVal) return;
      this.setLastSeenComment(2000);
    }
  },
  components: { Discussion }
};
</script>

<style lang="scss" scoped>
.editor-discussion {
  margin: 1rem 0 1.75rem;
  padding: 0.375rem 1rem;
  border: 1px solid #bbb;
}
</style>
