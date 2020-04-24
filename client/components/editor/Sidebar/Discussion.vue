<template>
  <div class="my-4 pa-4">
    <discussion
      :activity="activity"
      show-notifications />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import Discussion from '@/components/repository/common/Sidebar/Discussion/Embed';
import get from 'lodash/get';

export default {
  name: 'editor-discussion',
  props: {
    activity: { type: Object, required: true },
    isVisible: { type: Boolean, default: false }
  },
  computed: {
    ...mapGetters('repository/comments', ['getActivityComments']),
    comments: vm => vm.getActivityComments(vm.activity.id),
    lastCommentAt: vm => new Date(get(vm.comments[0], 'createdAt', 0)).getTime()
  },
  methods: mapMutations('repository/comments', ['markSeenComments']),
  watch: {
    isVisible(val) {
      if (!val) return;
      if (!this.lastCommentAt) return;
      const latestComment = {
        activityUid: this.activity.uid,
        lastCommentAt: this.lastCommentAt
      };
      setTimeout(() => this.markSeenComments(latestComment), 1000);
    }
  },
  components: {
    Discussion
  }
};
</script>
