<template>
  <ul class="thread">
    <li
      v-for="comment in thread"
      :key="comment.id"
      class="clearfix comment">
      <span v-if="avatars" class="pull-left avatar">
        <span class="icon mdi mdi-account-circle"></span>
      </span>
      <div class="content-wrapper">
        <span class="header">
          <span class="author">{{ comment.author.email }}</span>
          <button
            v-if="canEdit(comment, user)"
            :class="{ active: isEditing(comment) }"
            @click="toggleEdit(comment)"
            class="pull-right btn btn-material-icon btn-edit"
            type="button">
            <span class="icon mdi mdi-pencil"></span>
          </button>
          <timeago
            :since="comment.createdAt"
            :auto-update="60"
            class="pull-right time">
          </timeago>
        </span>
        <text-editor
          :value="comment.content"
          :focused="isEditing(comment)"
          :preview="!isEditing(comment)"
          @change="content => update(comment, content.trim())"
          class="content">
        </text-editor>
      </div>
    </li>
  </ul>
</template>

<script>
import { focus } from 'vue-focus';
import { mapGetters } from 'vuex-module';
import orderBy from 'lodash/orderBy';
import TextEditor from 'components/common/TextEditor';

export default {
  name: 'comment-thread',
  props: {
    comments: { type: Array, required: true },
    avatars: { type: Boolean, default: true },
    sort: { type: String, default: 'desc' }
  },
  computed: {
    ...mapGetters(['user']),
    thread() {
      return orderBy(this.comments, ['createdAt'], [this.sort]);
    }
  },
  data() {
    return { editing: null };
  },
  methods: {
    canEdit,
    isEditing(comment) {
      return comment === this.editing;
    },
    toggleEdit(comment) {
      this.editing = (this.editing !== comment) ? comment : null;
    },
    update(comment, content) {
      this.editing = null;
      if (!content || content === comment.content) return;
      comment.content = content;
      this.$emit('update:comment', comment.id, comment);
    }
  },
  components: { TextEditor },
  directives: { focus }
};

function canEdit(comment, user) {
  return comment.author.id === user.id;
}
</script>

<style lang="scss" scoped>
$color: #333;
$avatar-size: 40px;
$font-size: 16px;
$line-size: 20px;

.thread {
  margin: 0;
  padding: 0;
  list-style: none;
}

.comment {
  padding: 8px 0;

  .avatar {
    width: $avatar-size;
    height: $avatar-size;
    margin-top: 4px;
    margin-right: 10px;
    border-radius: 50%;
    line-height: $avatar-size;
    background: #e0e0e0;
    text-align: center;
    vertical-align: middle;
    overflow: hidden;

    .icon {
      color: #aaa;
      font-size: $avatar-size;
      background: #fff;
    }
  }

  .content-wrapper {
    overflow: hidden;
  }

  .content {
    font-size: $font-size;
    line-height: $line-size;
  }

  .header {
    display: block;
    margin-bottom: 4px;
    color: lighten($color, 25%);
    font-size: 14px;
    font-weight: 500;
    line-height: 24px;

    .time {
      font-size: 12px;
    }

    .btn-edit {
      width: 24px;
      margin-left: 4px;
      line-height: 24px;

      &.active {
        color: #337ab7;
      }
    }
  }
}
</style>
