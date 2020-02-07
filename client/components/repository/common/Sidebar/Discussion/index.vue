<template>
  <div v-if="commentsFetched" class="discussion">
    <div class="header">
      <span class="grey--text text--darken-3">
        <v-icon color="grey darken-2" class="pr-1">mdi-forum-outline</v-icon>
        Comments
      </span>
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
      <discussion-thread
        v-if="commentsCount"
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
          :placeholder="!commentsCount ? 'Start the discussion...' : 'Add a comment...'" />
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
    ...mapGetters('repository', ['activity']),
    ...mapGetters('repository/comments', ['commentsFetched', 'commentsCount']),
    commentsShownLimit: () => 4,
    editor: vm => vm.$refs.editor.$el
  },
  methods: {
    ...mapActions('repository/comments', [
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
  margin: 1rem 0 1.75rem;
  padding: 0.375rem 1rem;
  font-family: Roboto, Arial, sans-serif;
  border: 1px solid #bbb;
}

.header {
  margin: 0.875rem 0 1.625rem 0;
  font-size: 1.125rem;
  font-weight: 400;
}
</style>
