<template>
  <div class="comment">
    <comment-header
      @toggleEdit="toggleEdit"
      @remove="remove"
      v-bind="{ comment, isActivityThread, elementLabel, user }" />
    <div class="comment-body">
      <text-editor
        v-model.trim="content"
        :is-focused="isEditing"
        :show-preview="!isEditing"
        class="content" />
      <span v-if="isEditing" class="d-flex justify-end">
        <v-btn @click="reset" text small>Cancel</v-btn>
        <v-btn @click="save" color="green" text small>
          <v-icon class="pr-1">mdi-check</v-icon> Save
        </v-btn>
      </span>
    </div>
  </div>
</template>

<script>
import CommentHeader from './Header';
import { focus } from 'vue-focus';
import TextEditor from '../../TextEditor';

export default {
  name: 'thread-comment',
  props: {
    comment: { type: Object, required: true },
    isActivityThread: { type: Boolean, default: false },
    elementLabel: { type: String, default: null },
    user: { type: Object, required: true }
  },
  data: vm => ({
    content: vm.comment.content,
    isEditing: false
  }),
  methods: {
    toggleEdit() {
      this.isEditing = !this.isEditing;
    },
    save() {
      const { comment, content } = this;
      if (!content) return this.remove();
      this.toggleEdit();
      this.$emit('update', comment, content);
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
  flex-direction: column;
  font-family: Roboto, Arial, sans-serif;

  &-body {
    flex: 1;
    padding: 0.375rem 0 0 2.5rem;
  }

  .content {
    margin: 0.375rem 0 0 0;
  }
}
</style>
