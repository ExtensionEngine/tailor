<template>
  <div class="my-4 pa-4">
    <discussion :activity="activity" />
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
    isVisible: { type: Boolean, default: false }
  },
  computed: {
    ...mapGetters('repository/comments', ['getComments']),
    comments: vm => vm.getComments({ activityId: vm.activity.id }),
    lastCommentAt: vm => new Date(get(vm.comments[0], 'createdAt', 0)).getTime()
  },
  methods: {
    ...mapMutations('repository/comments', ['markSeenComments']),
    setLastSeenComment(timeout) {
      const payload = {
        activityUid: this.activity.uid,
        lastCommentAt: this.lastCommentAt
      };
      setTimeout(() => this.markSeenComments(payload), timeout);
    }
  },
  watch: {
    isVisible(val) {
      if (!val) return;
      if (!this.lastCommentAt) return;
      this.setLastSeenComment(1000);
    },
    comments(val, oldVal) {
      if (!this.isVisible) return;
      if (val === oldVal) return;
      this.setLastSeenComment(2000);
    }
  },
  components: {
    Discussion
  }
};
</script>
