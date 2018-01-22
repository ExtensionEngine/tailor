<template>
  <div class="discussion">
    <h4 class="title">
        Comments
      <span
        v-if="commentsCount"
        class="pull-right count">
        <span class="icon mdi mdi-message-reply"></span>
        {{ commentsCount }}
      </span>
    </h4>
    <div :direction="direction" class="vertical-layout">
      <div class="editor-wrapper">
        <text-editor
          v-model="comment.content"
          @change="post"
          placeholder="Add a comment"
          ref="editor"
          class="editor">
        </text-editor>
        <div class="clearfix controls">
          <button
            @click="post"
            type="button"
            class="btn btn-default btn-material pull-right btn-post">
            Post
          </button>
        </div>
      </div>
      <div class="spacer"></div>
      <discussion-thread
        v-bind="$attrs"
        :sort="sortOrder"
        :showMore="showMore"
        class="discussion-thread">
      </discussion-thread>
      <button
        @click="showMore=!showMore"
        class="btn btn-material btn-show">
        Show {{ showMore ? 'less' : 'more' }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex-module';
import DiscussionThread from './Thread';
import TextEditor from 'components/common/TextEditor';

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
      comment: createComment()
    };
  },
  computed: {
    ...mapGetters(['user']),
    ...mapGetters(['activity'], 'course'),
    ...mapGetters(['commentsCount', 'commentsFetched'], 'comments'),
    direction() {
      return this.editorPosition === 'bottom' ? 'reverse' : '';
    },
    sortOrder() {
      return this.editorPosition === 'bottom' ? 'asc' : 'desc';
    },
    editor() {
      return this.$refs.editor.$el;
    }
  },
  methods: {
    ...mapActions(['fetch', 'save', 'subscribe', 'unsubscribe'], 'comments'),
    fetchComments() {
      if (this.commentsFetched) return;
      this.fetch({ activityId: this.activity.id });
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
      this.fetchComments();
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
$font-size: 16px;
$line-size: 22px;
$title-color: #454545;
$editor-size: 60px;

.discussion {
  padding: 3px 12px 3px 8px;
}

.title {
  margin-bottom: 16px;
  color: $title-color;
  font-size: 18px;
  font-weight: 400;
}

.count {
  display: inline-block;
  vertical-align: middle;
  color: lighten($title-color, 15%);
  font-size: 16px;
  font-weight: 500;
  line-height: 18px;

  .icon {
    display: inline-block;
    vertical-align: top;
    line-height: inherit;
  }
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
  padding: 4px 8px;
  color: #737373;
  background: darken(#fff, 4%);
  text-transform: none;
}

.btn-post {
  padding: 6px 8px;
  background: darken(#fff, 8%);

  &:hover {
    background: darken(#fff, 16%);
  }
}
</style>
