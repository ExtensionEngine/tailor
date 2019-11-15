<template>
  <div class="discussion">
    <h4 class="header">
      <span class="pull-left">Comments</span>
      <span
        v-show="showBtnPosition === 'top'"
        @click="showMore = !showMore"
        class="pull-left btn-show"
        role="button">
        Show {{ showMore ? 'less' : 'more' }}
      </span>
    </h4>
    <div :direction="direction" class="vertical-layout">
      <div class="editor-wrapper">
        <text-editor
          ref="editor"
          v-model="comment.content"
          @change="post"
          placeholder="Add a comment..."
          class="editor" />
        <div class="clearfix controls">
          <v-btn
            @click="post"
            color="primary"
            outlined
            class="pull-right">
            Post
          </v-btn>
        </div>
      </div>
      <div class="spacer"></div>
      <discussion-thread
        v-bind="$attrs"
        :sort="sortOrder"
        :show-more="showMore"
        :min-displayed="minDisplayedComments"
        class="discussion-thread" />
      <span v-if="showBtnPosition === 'bottom'" class="btn-show">
        <span @click="showMore = true" class="btn" role="button">
          Show more
        </span>
      </span>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import DiscussionThread from './Thread';
import TextEditor from 'components/common/TextEditor';

const MIN_DISPLAYED_COMMENTS = 4;
const createComment = () => ({ content: '' });

export default {
  name: 'discussion',
  inheritAttrs: true,
  props: {
    editorPosition: { type: String, default: 'top' }
  },
  data() {
    return {
      showMore: false,
      comment: createComment(),
      minDisplayedComments: MIN_DISPLAYED_COMMENTS
    };
  },
  computed: {
    ...mapState({ user: state => state.auth.user }),
    ...mapGetters('course', ['activity']),
    ...mapGetters('comments', ['commentsCount', 'commentsFetched']),
    direction() {
      return this.editorPosition === 'bottom' ? 'reverse' : '';
    },
    sortOrder() {
      return this.editorPosition === 'bottom' ? 'asc' : 'desc';
    },
    editor() {
      return this.$refs.editor.$el;
    },
    showBtnPosition() {
      if (this.commentsCount <= this.minDisplayedComments) return '';
      if (this.editorPosition === 'top' && !this.showMore) return 'bottom';
      return 'top';
    }
  },
  methods: {
    ...mapActions('comments',
      ['setEndpoint', 'fetch', 'save', 'subscribe', 'unsubscribe']
    ),
    fetchComments() {
      if (this.commentsFetched) return;
      this.fetch(this.activity);
    },
    post() {
      if (!this.comment.content) return;
      const author = this.user;
      const activityId = this.activity.id;
      const createdAt = Date.now();
      const updatedAt = Date.now();
      const { content } = this.comment;
      const comment = { content, author, activityId, createdAt, updatedAt };
      this.save(comment)
        .then(() => {
          this.comment = createComment();
          // Keep editor inside viewport.
          if (this.editorPosition === 'bottom') {
            this.$nextTick(() => this.editor.scrollIntoView());
          }
        });
    }
  },
  watch: {
    activity() {
      this.comment = createComment();
      this.fetchComments();
      this.showMore = false;
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
$font-size: 16px;
$line-size: 22px;
$title-color: #454545;
$editor-size: 60px;

.discussion {
  padding: 3px 12px 3px 8px;
}

.header {
  height: 18px;
  margin-bottom: 16px;
  color: $title-color;
  font-size: 18px;
  font-weight: 400;
  line-height: 18px;
}

.spacer {
  height: 16px;
}

.editor {
  min-height: $editor-size;
  margin-bottom: 10px;
  font-size: $font-size;
  line-height: $line-size;
}

.btn-show {
  color: #0f47a1;
  font-size: 14px;
  text-align: center;
  text-transform: none;
  user-select: none;

  .header & {
    margin-left: 25px;
    line-height: 20px;
  }
}
</style>
