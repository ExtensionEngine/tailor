<template>
  <div class="discussion">
    <h4 class="title">
      Comments
      <span
        v-if="comments.length"
        class="pull-right count">
        <span class="icon mdi mdi-message-reply"></span>
        {{ comments.length }}
      </span>
    </h4>
    <div :direction="direction" class="vertical-layout">
      <div class="editor-wrapper">
        <text-editor
          v-model="comment.content"
          @change="post(comment)"
          placeholder="Add a comment"
          ref="editor"
          class="editor">
        </text-editor>
        <div class="clearfix controls">
          <button
            @click="post(comment)"
            type="button"
            class="btn btn-default btn-material pull-right btn-post">
            Post
          </button>
        </div>
      </div>
      <div class="spacer"></div>
      <comment-thread
        v-bind="$attrs"
        :comments="comments"
        @update:comment="update"
        class="comment-thread">
      </comment-thread>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex-module';
import CommentThread from './CommentThread';
import TextEditor from 'components/common/TextEditor';
import trim from 'lodash/trim';

const createComment = () => ({ content: '' });

export default {
  name: 'discussion',
  inheritAttrs: true,
  props: {
    editorPosition: { type: String, default: 'top' }
  },
  data() {
    return {
      comment: createComment(),
      comments: []
    };
  },
  computed: {
    ...mapGetters(['user']),
    direction() {
      return this.editorPosition === 'bottom' ? 'reverse' : '';
    },
    editor() {
      return this.$refs.editor.$el;
    }
  },
  methods: {
    onEnter(e) {
      if (e.shiftKey) return;
      e.preventDefault();
      this.post(this.comment);
    },
    post(comment = {}) {
      comment.content = trim(comment.content);
      if (!comment.content) return;
      comment.author = this.user;
      comment.createdAt = Date.now();
      this.comments.push(comment);
      this.comment = createComment();
      // Keep editor inside viewport.
      if (this.editorPosition === 'bottom') {
        this.$nextTick(() => this.editor.scrollIntoView());
      }
    },
    update(id, comment) {
      // TODO: Implement comment update logic.
    }
  },
  components: {
    CommentThread,
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
  padding: 3px 8px;
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

.btn-post {
  padding: 6px 8px;
  background: darken(#fff, 8%);

  &:hover {
    background: darken(#fff, 16%);
  }
}
</style>
