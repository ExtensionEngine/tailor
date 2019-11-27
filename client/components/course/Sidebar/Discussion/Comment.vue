<template>
  <li
    @mouseover="hovered = true"
    @mouseleave="hovered = false">
    <span v-if="avatar" class="pull-left avatar">
      <avatar
        :size="38"
        :username="comment.author.email"
        :initials="authorInitials"
        :src="user.imgUrl"
        color="#ffffff" />
    </span>
    <div class="content-wrapper">
      <span class="header">
        <span
          :class="{ 'current-user': isAuthor }"
          class="author">
          {{ comment.author.email }}
        </span>
        <span v-if="isEdited" class="edited-icon icon mdi mdi-pencil"></span>
        <button
          v-if="showActions"
          @click="showDropdown = !showDropdown"
          @blur="showDropdown = false"
          :class="{ active: showDropdown }"
          class="pull-right btn btn-material-icon btn-actions">
          <span class="icon mdi mdi-dots-vertical"></span>
        </button>
        <ul
          v-show="showDropdown"
          class="actions">
          <li
            @mousedown.prevent="toggleEdit"
            class="action"
            role="button">
            <span class="icon mdi mdi-pencil"></span>
            Edit
          </li>
          <li
            @mousedown.stop="remove"
            class="action"
            role="button">
            <span class="icon mdi mdi-delete"></span>
            Remove
          </li>
        </ul>
        <timeago
          :datetime="comment.createdAt"
          :auto-update="60"
          class="pull-right time" />
      </span>
      <text-editor
        @blur="update"
        @change="update"
        :value="comment.content"
        :focused="editing"
        :preview="!editing"
        :class="{ deleted: isDeleted }"
        class="content" />
    </div>
  </li>
</template>

<script>
import Avatar from 'vue-avatar';
import { focus } from 'vue-focus';
import { mapState } from 'vuex';
import TextEditor from 'components/common/TextEditor';

export default {
  name: 'thread-comment',
  props: {
    comment: { type: Object, required: true },
    avatar: { type: Boolean, default: true }
  },
  data() {
    return {
      editing: false,
      showDropdown: false,
      hovered: false
    };
  },
  computed: {
    ...mapState({ user: state => state.auth.user }),
    authorInitials() {
      return this.comment.author.email.substr(0, 2).toUpperCase();
    },
    isAuthor() {
      return this.comment.author.id === this.user.id;
    },
    isEdited() {
      return this.comment.createdAt !== this.comment.updatedAt;
    },
    isDeleted() {
      return !!this.comment.deletedAt;
    },
    showActions() {
      return this.hovered && this.isAuthor && !this.isDeleted;
    }
  },
  methods: {
    toggleEdit() {
      this.editing = !this.editing;
    },
    update(content) {
      this.editing = false;
      if (!content || content === this.comment.content) return;
      this.$emit('update', this.comment, content);
    },
    remove() {
      this.$emit('remove', this.comment);
    }
  },
  directives: { focus },
  components: { Avatar, TextEditor }
};
</script>

<style lang="scss" scoped>
$color: #333;
$color-light: lighten($color, 25%);
$avatar-size: 40px;
$font-size: 16px;
$line-size: 20px;

.comment {
  padding: 8px 0;

  .avatar {
    margin-top: 4px;
    margin-right: 10px;
  }

  .content-wrapper {
    overflow: hidden;
  }

  .content {
    font-size: $font-size;
    line-height: $line-size;

    &.deleted ::v-deep .content span {
      color: $color-light;
      font-weight: 400;
      font-style: italic;
    }
  }

  .header {
    margin-bottom: 4px;
    color: $color-light;
    font-size: 14px;
    font-weight: 500;
    line-height: 24px;

    .edited-icon {
      color: $color-light;
      font-size: 12px;
    }

    .current-user {
      color: #0f47a1;
    }

    .time {
      margin-right: 5px;
      font-size: 12px;
    }

    .btn-actions {
      width: 24px;
      line-height: 24px;

      &.active {
        color: #337ab7;
      }
    }

    .actions {
      z-index: 1000;
      position: absolute;
      right: 18px;
      padding: 3px 0;
      font-size: 12px;
      list-style: none;
      background: #fff;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
      border-radius: 2px;
    }

    .action {
      padding: 0 5px;

      &:hover {
        background: #e0e0e0;
      }
    }
  }
}
</style>
