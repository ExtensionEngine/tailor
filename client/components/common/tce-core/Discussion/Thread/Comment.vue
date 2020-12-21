<template>
  <div class="comment">
    <v-avatar size="34" class="comment-avatar">
      <img :src="author.imgUrl">
    </v-avatar>
    <div class="comment-body pl-3">
      <comment-header v-bind="{ author, isEdited, createdAt: comment.createdAt }" />
      <text-editor
        v-model="content"
        :is-focused="isEditing"
        :show-preview="!isEditing"
        class="content" />
      <span v-if="isEditing" class="float-left">
        <v-btn @click="reset" text small>Cancel</v-btn>
        <v-btn
          @click="save"
          :disabled="content && !content.trim()"
          color="green"
          text small>
          <v-icon class="pr-1">mdi-check</v-icon> Save
        </v-btn>
      </span>
    </div>
    <div v-if="showOptions" class="actions">
      <v-btn
        v-for="{ name, action, icon } in options"
        :key="name"
        @mousedown.prevent="action"
        x-small icon
        class="mr-1">
        <v-icon size="14" color="grey">{{ icon }}</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import CommentHeader from './Header';
import { focus } from 'vue-focus';
import TextEditor from '../TextEditor';

export default {
  name: 'thread-comment',
  props: {
    comment: { type: Object, required: true },
    user: { type: Object, required: true }
  },
  data: vm => ({
    content: vm.comment.content,
    isEditing: false
  }),
  computed: {
    author: vm => vm.comment.author,
    isEdited: vm => vm.comment.createdAt !== vm.comment.updatedAt,
    isDeleted: vm => !!vm.comment.deletedAt,
    isAuthor: vm => vm.author.id === vm.user.id,
    showOptions: vm => vm.isAuthor && !vm.isDeleted,
    options: vm => [
      { name: 'Edit', action: vm.toggleEdit, icon: 'mdi-pencil-outline' },
      { name: 'Remove', action: vm.remove, icon: 'mdi-trash-can-outline' }]
  },
  methods: {
    toggleEdit() {
      this.isEditing = !this.isEditing;
    },
    save() {
      if (!this.content) return;
      this.toggleEdit();
      this.$emit('update', this.comment, this.content);
    },
    remove() {
      this.$emit('remove', this.comment);
    },
    reset() {
      this.content = this.comment.content;
      this.isEditing = false;
    }
  },
  watch: {
    comment: {
      deep: true,
      handler: 'reset'
    }
  },
  directives: { focus },
  components: { CommentHeader, TextEditor }
};
</script>

<style lang="scss" scoped>
.comment {
  display: flex;
  font-family: Roboto, Arial, sans-serif;

  &-avatar {
    width: 2.5rem;
    margin-top: 0.375rem;
    overflow: hidden;
  }

  &-body {
    flex: 1;
  }

  .content {
    margin: 0.375rem 0 0 0;
  }
}

.v-menu__content {
  cursor: pointer !important;
}
</style>
