<template>
  <div class="comment">
    <comment-header
      @toggleEdit="toggleEdit"
      @remove="remove"
      @resolve="$emit('resolve', comment)"
      v-bind="{ comment, isActivityThread, isResolved, elementLabel, user }" />
    <div class="comment-body">
      <comment-preview
        v-if="!isEditing"
        @unresolve="$emit('unresolve', comment)"
        v-bind="{ content, isResolved }" />
      <template v-else>
        <v-textarea
          v-model.trim="content"
          rows="3"
          autofocus
          outlined
          auto-grow
          clearable
          counter
          class="comment-editor" />
        <span class="d-flex justify-end">
          <v-btn @click="reset" text small>Cancel</v-btn>
          <v-btn @click="save" color="green" text small>
            <v-icon class="pr-1">mdi-check</v-icon> Save
          </v-btn>
        </span>
      </template>
    </div>
  </div>
</template>

<script>
import CommentHeader from './Header.vue';
import CommentPreview from './Preview.vue';

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
  computed: {
    isResolved: ({ comment }) => !!comment.resolvedAt
  },
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
  components: { CommentHeader, CommentPreview }
};
</script>

<style lang="scss" scoped>
.comment {
  display: flex;
  flex-direction: column;
  font-family: Roboto, Arial, sans-serif;

  &-body {
    flex: 1;
    padding: 0 0.25rem 0 2.625rem;
  }

  &-editor.v-textarea {
    margin: 0.75rem 0 0;

    ::v-deep .v-input__slot {
      width: auto;
    }
  }
}
</style>
