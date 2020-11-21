<template>
  <div class="editor-discussion">
    <discussion v-bind="{ activity, contentElement }" />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import Discussion from '@/components/repository/common/Discussion';
import get from 'lodash/get';

export default {
  name: 'editor-discussion',
  props: {
    activity: { type: Object, required: true },
    contentElement: { type: Object, default: null },
    isVisible: { type: Boolean, default: false }
  },
  computed: {
    ...mapGetters('repository/comments', ['getComments']),
    comments() {
      const { id: activityId } = this.activity;
      const contentElementId = this.contentElement ? this.contentElement.id : null;
      return this.getComments({ activityId, contentElementId });
    },
    lastCommentAt: vm => new Date(get(vm.comments[0], 'createdAt', 0)).getTime()
  },
  methods: {
    ...mapMutations('repository/comments', ['markSeenComments']),
    setLastSeenComment(timeout) {
      const { activity, contentElement, lastCommentAt } = this;
      const uids = { activityUid: activity.uid, ceUid: contentElement?.uid };
      setTimeout(() => this.markSeenComments({ ...uids, lastCommentAt }), timeout);
    }
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
  margin: 1rem 0;
  padding: 1rem;
}
</style>
