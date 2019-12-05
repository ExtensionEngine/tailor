<template>
  <div v-if="commentsFetched" class="discussion">
    <div class="header">
      <span>Comments</span>
      <v-btn
        v-if="commentsShownLimit < commentsCount"
        @click="showAll = !showAll"
        text
        x-small
        class="float-right mt-1">
        Show {{ showAll ? 'less' : 'more' }}
      </v-btn>
    </div>
    <div>
      <v-alert
        v-if="!commentsCount"
        color="grey darken-1"
        icon="mdi-comment"
        outlined>
        No comments yet!
      </v-alert>
      <discussion-thread
        v-else
        v-bind="$attrs"
        :user="user"
        :min-displayed="commentsShownLimit"
        :show-all="showAll"
        sort-order="'asc'"
        class="mt-2" />
      <div class="text-right">
        <text-editor
          ref="editor"
          v-model="comment.content"
          @change="post"
          placeholder="Add a comment..." />
        <v-btn @click="post" icon>
          <v-icon>mdi-send</v-icon>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import DiscussionThread from './Thread';
import TextEditor from './TextEditor';

const initCommentInput = () => ({ content: '' });

export default {
  name: 'discussion',
  inheritAttrs: true,
  data: () => ({ showAll: false, comment: initCommentInput() }),
  computed: {
    ...mapState({ user: state => state.auth.user }),
    ...mapGetters('course', ['activity']),
    ...mapGetters('comments', ['commentsFetched', 'commentsCount']),
    commentsShownLimit: () => 4,
    editor: vm => vm.$refs.editor.$el
  },
  methods: {
    ...mapActions('comments', [
      'setEndpoint', 'fetch', 'save', 'subscribe', 'unsubscribe']),
    fetchComments() {
      if (this.commentsFetched) return;
      this.fetch(this.activity);
    },
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
    activity() {
      this.comment = initCommentInput();
      this.fetchComments();
      this.showAll = false;
    }
  },
  mounted() {
    const { courseId } = this.$route.params;
    this.setEndpoint(`/repositories/${courseId}/comments`);
    this.fetchComments();
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
.discussion {
  margin: 1rem 0.25rem 1.75rem;
  padding: 0.375rem 1rem;
  font-family: Roboto, Arial, sans-serif;
  background: #fafafa;
  border: 1px dashed #bbb;
}

.header {
  margin: 0.875rem 0 1.625rem 0;
  font-size: 1.125rem;
  font-weight: 400;
}
</style>
