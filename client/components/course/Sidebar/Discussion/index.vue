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
    <div class="form-group editor">
      <textarea
        v-model="comment.content"
        @keydown.enter="onEnter"
        placeholder="Add a comment"
        class="form-control">
      </textarea>
      <div class="content">
        <pre><span>{{ comment.content }}</span><br></pre>
      </div>
    </div>
    <div class="clearfix controls">
      <button
        @click="post(comment)"
        type="button"
        class="btn btn-default btn-material pull-right btn-post">
        Post
      </button>
    </div>
    <comment-thread
      :comments="comments"
      :avatars="true"
      sort="desc">
    </comment-thread>
  </div>
</template>

<script>
import { mapGetters } from 'vuex-module';
import CommentThread from './CommentThread';
import trim from 'lodash/trim';

const createComment = () => ({ content: '' });

export default {
  name: 'discussion',
  data() {
    return {
      comment: createComment(),
      comments: []
    };
  },
  computed: {
    ...mapGetters(['user'])
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
    }
  },
  components: { CommentThread }
};
</script>

<style lang="scss" scoped>
$font-size: 16px;
$line-size: 22px;
$title-color: #454545;
$color: #333;
$editor-height: 60px;

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

.editor {
  position: relative;
  margin-bottom: 10px;
  color: $color;
  font-size: $font-size;
  line-height: $line-size;

  textarea {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    font: inherit;
    box-sizing: content-box;
    overflow: hidden;
    resize: none;
    letter-spacing: inherit;
    outline: none;

    &:focus {
      outline: none;
    }
  }

  .content {
    min-height: $editor-height;
    visibility: hidden;
  }

  .content pre {
    height: 100%;
    margin: 0;
    padding: 0;
    font: inherit;
    background: inherit;
    border: none;
    word-break: break-all;
    word-wrap: break-word;
    white-space: pre-wrap;
    overflow: hidden;
  }
}

.controls {
  margin-bottom: 16px;

  .btn-post {
    padding: 6px 8px;
    background: darken(#fff, 8%);

    &:hover {
      background: darken(#fff, 16%);
    }
  }
}
</style>
