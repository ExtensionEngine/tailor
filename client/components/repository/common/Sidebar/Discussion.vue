<template>
  <div class="activity-discussion">
    <discussion
      @save="saveComment"
      @update="saveComment"
      @remove="remove"
      :comments="comments"
      :user="user"
      show-heading />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Discussion from 'tce-core/Discussion';

export default {
  name: 'activity-discussion',
  inject: ['$getCurrentUser'],
  props: {
    activity: { type: Object, required: true }
  },
  computed: {
    ...mapGetters('repository/comments', ['getActivityComments']),
    user: vm => vm.$getCurrentUser(),
    comments: vm => vm.getActivityComments(vm.activity.id)
  },
  methods: {
    ...mapActions('repository/comments', ['fetch', 'save', 'update', 'remove']),
    saveComment(comment) {
      const action = comment.id ? 'save' : 'update';
      return this[action]({
        ...comment,
        activityId: this.activity.id,
        author: this.user
      });
    }
  },
  async created() {
    await this.fetch({ activityId: this.activity.id });
  },
  components: { Discussion }
};
</script>

<style lang="scss" scoped>
.activity-discussion {
  margin: 1rem 0 1.75rem;
  padding: 0.375rem 1rem;
  border: 1px solid #bbb;
}
</style>
