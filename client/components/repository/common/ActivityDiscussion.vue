<template>
  <v-sheet
    v-bind="sheetStyles"
    outlined rounded
    class="activity-discussion py-2 px-4">
    <discussion
      @save="saveComment"
      @update="saveComment"
      @remove="remove"
      @seen="setLastSeenComment"
      @unresolve="updateResolvement"
      v-bind="{ comments, unseenComments, showHeading, user }"
      scroll-target="inputContainer"
      show-notifications is-activity-thread />
  </v-sheet>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import { Discussion } from '@tailor-cms/core-components';
import get from 'lodash/get';
import orderBy from 'lodash/orderBy';

export default {
  name: 'activity-discussion',
  props: {
    activity: { type: Object, required: true },
    panel: { type: Boolean, default: false },
    showHeading: { type: Boolean, default: false }
  },
  computed: {
    ...mapGetters('repository/comments', ['getComments', 'getUnseenActivityComments']),
    ...mapState({ user: state => state.auth.user }),
    comments() {
      const comments = this.getComments({ activityId: this.activity.id });
      return orderBy(comments, 'createdAt', 'desc');
    },
    unseenComments: vm => vm.getUnseenActivityComments(vm.activity),
    lastCommentAt: vm => new Date(get(vm.comments[0], 'createdAt', 0)).getTime(),
    sheetStyles: vm => vm.panel
      ? { color: 'blue-grey lighten-5', elevation: 1 }
      : { color: 'transparent', elevation: 0 }
  },
  methods: {
    ...mapActions('repository/comments', [
      'fetch', 'save', 'update', 'remove', 'updateResolvement'
    ]),
    ...mapMutations('repository/comments', ['markSeenComments']),
    saveComment(comment) {
      const action = comment.id ? 'update' : 'save';
      const { activity, user: author } = this;
      return this[action]({ ...comment, author, activityId: activity.id });
    },
    setLastSeenComment(timeout = 200) {
      const { activity, lastCommentAt } = this;
      const payload = { activityUid: activity.uid, lastCommentAt };
      setTimeout(() => this.markSeenComments(payload), timeout);
    }
  },
  created() {
    this.fetch({ activityId: this.activity.id });
  },
  components: { Discussion }
};
</script>
