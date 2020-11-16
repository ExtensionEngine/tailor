<template>
  <div class="discussion-container">
    <discussion
      @save="saveComment"
      @update="saveComment"
      @remove="remove"
      v-bind="{ comments, user, showHeading }" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Discussion from 'tce-core/Discussion';

export default {
  name: 'discussion-wrapper',
  inject: ['$getCurrentUser'],
  props: {
    activity: { type: Object, default: null },
    contentElement: { type: Object, default: null },
    showHeading: { type: Boolean, default: true }
  },
  computed: {
    ...mapGetters('repository/comments', ['getComments']),
    user: vm => vm.$getCurrentUser(),
    contentElementId: vm => vm.contentElement ? vm.contentElement.id : null,
    activityId: vm => vm.contentElement ? vm.contentElement.activityId : vm.activity.id,
    comments() {
      const { contentElementId, activityId } = this;
      return this.getComments({ contentElementId, activityId });
    }
  },
  methods: {
    ...mapActions('repository/comments', ['fetch', 'save', 'update', 'remove']),
    saveComment(comment) {
      const action = comment.id ? 'update' : 'save';
      const { activityId, contentElementId, user: author } = this;
      return this[action]({ ...comment, activityId, contentElementId, author });
    }
  },
  async created() {
    const { activityId, contentElementId } = this;
    await this.fetch({ activityId, contentElementId });
  },
  components: { Discussion }
};
</script>

<style lang="scss" scoped>
.discussion-container {
  margin: 1rem 0 1.75rem;
  padding: 0.375rem 1rem;
  border: 1px solid #bbb;
}
</style>
