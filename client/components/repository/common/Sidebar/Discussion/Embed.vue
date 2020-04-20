<template>
  <div class="embedded-discussion">
    <div v-if="showHeading" class="header grey--text text--darken-3">
      <v-icon color="grey darken-2" class="pr-1">mdi-forum-outline</v-icon>
      Comments
    </div>
    <v-alert
      v-if="!commentsCount && showNotifications"
      color="blue-grey darken-3"
      icon="mdi-chat"
      prominent text>
      Be the First to Comment!
    </v-alert>
    <discussion-thread
      v-if="thread.length"
      :items="thread"
      :user="user"
      class="mt-2" />
    <div class="text-right">
      <text-editor
        ref="editor"
        v-model="comment.content"
        @change="post"
        :placeholder="commentsCount ? 'Add a comment...' : 'Start the discussion...'" />
      <v-btn @click="post" icon>
        <v-icon>mdi-send</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import DiscussionThread from './Thread';
import get from 'lodash/get';
import orderBy from 'lodash/orderBy';
import TextEditor from './TextEditor';

const initCommentInput = () => ({ content: '' });

export default {
  name: 'embedded-discussion',
  inheritAttrs: true,
  props: {
    activity: { type: Object, required: true },
    showHeading: { type: Boolean, default: false },
    showNotifications: { type: Boolean, default: false },
    isVisible: { type: Boolean, default: false }
  },
  data: () => ({ comment: initCommentInput() }),
  computed: {
    ...mapState({ user: state => state.auth.user }),
    ...mapGetters('repository/comments', ['getActivityComments']),
    comments: vm => vm.getActivityComments(vm.activity.id),
    recentComment: vm => new Date(get(vm.comments[0], 'createdAt', 0)).getTime(),
    thread: vm => orderBy(vm.comments, ['createdAt'], ['asc']),
    commentsCount: vm => vm.thread.length,
    editor: vm => vm.$refs.editor.$el
  },
  methods: {
    ...mapActions('repository/comments',
      ['fetch', 'save', 'subscribe', 'unsubscribe']),
    ...mapMutations('repository/comments', ['setSeenComment']),
    async post() {
      if (!this.comment.content) return;
      const payload = {
        content: this.comment.content,
        author: this.user,
        activityId: this.activity.id,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      this.comment = initCommentInput();
      await this.save(payload);
      // Keep editor inside viewport.
      this.$nextTick(() => this.editor.scrollIntoView());
    }
  },
  watch: {
    commentsCount() {
      this.$emit('change', this.thread);
    },
    isVisible(val) {
      if (!val) return;
      const latestComment = {
        activityUid: this.activity.uid,
        recentComment: this.recentComment
      };
      setTimeout(() => this.setSeenComment(latestComment), 1000);
    }
  },
  async created() {
    await this.fetch(this.activity.id);
    this.comment = initCommentInput();
    this.subscribe();
  },
  beforeDestroy() {
    this.unsubscribe();
  },
  components: {
    DiscussionThread,
    TextEditor
  }
};
</script>

<style lang="scss" scoped>
.embedded-discussion {
  font-family: Roboto, Arial, sans-serif;
}

.header {
  margin: 0.875rem 0 1.625rem 0;
  font-size: 1.125rem;
  font-weight: 400;
}
</style>
