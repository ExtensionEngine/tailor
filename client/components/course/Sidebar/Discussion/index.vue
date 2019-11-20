<template>
  <div class="discussion px-4 py-2 mx-2 mt-5">
    <div class="header mt-3 mb-6">
      <span>Comments</span>
      <v-btn
        @click="showAll = !showAll"
        text
        x-small
        class="float-right mt-1">
        Show {{ showAll ? 'less' : 'more' }}
      </v-btn>
    </div>
    <div>
      <discussion-thread
        v-bind="$attrs"
        :user="user"
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
    editor() {
      return this.$refs.editor.$el;
    }
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
      await this.save(payload);
      this.comment = initCommentInput();
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
  background: #fafafa;
  border: 1px solid #bbb;
}

.header {
  font-size: 1.125rem;
  font-weight: 400;
}
</style>
