<template>
  <div class="my-4 pa-4">
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
      const { activity, lastCommentAt } = this;
      const payload = { activityUid: activity.uid, lastCommentAt };
      setTimeout(() => this.markSeenComments(payload), timeout);
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
