<template>
  <div ref="discussion" class="embedded-discussion">
    <resolve-button v-if="showResolveButton" @click="resolveAll" />
    <div :class="{ 'pb-7': !showHeading && hasHiddenComments }">
      <v-btn
        v-if="hasHiddenComments"
        @click="showAll = !showAll"
        text x-small
        class="float-right mt-1">
        Show {{ showAll ? 'less' : 'more' }}
      </v-btn>
    </div>
    <div v-if="showHeading" class="header d-flex grey--text text--darken-3">
      <v-icon color="grey darken-3" class="mr-2">
        mdi-forum-outline
      </v-icon>
      Comments
    </div>
    <v-alert
      v-if="!commentsCount && showNotifications"
      color="primary lighten-5"
      icon="mdi-keyboard-outline"
      prominent
      class="alert">
      <span class="px-1 subtitle-2">
        Be the First to Comment!
      </span>
    </v-alert>
    <discussion-thread
      v-if="thread.length"
      @update="$emit('update', $event)"
      @resolve="$emit('resolve', $event)"
      @unresolve="$emit('unresolve', $event)"
      @seen="$emit('seen')"
      @remove="remove"
      @showAll="showAll = $event"
      :items="thread"
      :show-all="showAll"
      :min-displayed="commentsShownLimit"
      :is-activity-thread="isActivityThread"
      :unseen-count="unseenComments.length"
      :user="user"
      class="mt-2" />
    <div ref="inputContainer" class="text-right">
      <v-textarea
        ref="commentInput"
        v-model.trim="comment.content"
        @focus="$emit('seen')"
        @update:error="error = $event"
        :placeholder="commentsCount ? 'Add a comment...' : 'Start the discussion...'"
        :rules="rules"
        rows="3"
        outlined auto-grow clearable counter
        class="comment-input" />
      <v-btn @click="post" :disabled="isTextEditorEmpty || error" icon>
        <v-icon>mdi-send</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import DiscussionThread from './Thread/index.vue';
import { mapRequests } from '@extensionengine/vue-radio';
import orderBy from 'lodash/orderBy';
import ResolveButton from './ResolveButton.vue';

const initCommentInput = () => ({ content: '' });

const maxLength = input => {
  if (!input) return true;
  return input.length <= 600 || 'Max 600 characters';
};

export default {
  name: 'tailor-embedded-discussion',
  inheritAttrs: true,
  props: {
    comments: { type: Array, default: () => [] },
    unseenComments: { type: Array, default: () => [] },
    commentsShownLimit: { type: Number, default: 5 },
    scrollTarget: { type: String, default: 'discussion' },
    showHeading: { type: Boolean, default: false },
    showNotifications: { type: Boolean, default: false },
    isActivityThread: { type: Boolean, default: false },
    hasUnresolvedComments: { type: Boolean, default: false },
    isVisible: { type: Boolean, default: false },
    user: { type: Object, required: true }
  },
  data: () => ({
    showAll: false,
    comment: initCommentInput(),
    error: false
  }),
  computed: {
    rules: () => [maxLength],
    thread() {
      const { comments, unseenComments } = this;
      const processedThread = comments.map(comment => {
        const unseen = unseenComments.find(it => it.id === comment.id);
        return { ...comment, unseen: !!unseen };
      });
      return orderBy(processedThread, ['unseen', 'createdAt'], 'asc');
    },
    commentsCount: vm => vm.thread.length,
    hasHiddenComments: vm => vm.commentsShownLimit < vm.commentsCount,
    isTextEditorEmpty: vm => !vm.comment.content?.trim(),
    showResolveButton: vm => vm.hasUnresolvedComments && !vm.isActivityThread
  },
  methods: {
    ...mapRequests('app', ['showConfirmationModal']),
    post() {
      const { scrollTarget, comment, user: author } = this;
      if (!comment.content) return;
      const payload = {
        content: comment.content,
        author,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      this.comment = initCommentInput();
      this.$emit('save', payload);
      // Keep editor/discussion container inside viewport.
      const scrollOptions = { block: 'center', behavior: 'smooth' };
      this.$nextTick(() => this.$refs[scrollTarget].scrollIntoView(scrollOptions));
    },
    remove(comment) {
      this.showConfirmationModal({
        title: 'Remove comment',
        message: 'Are you sure you want to remove this comment?',
        action: () => this.$emit('remove', comment),
        ...this.onConfirmationActive()
      });
    },
    resolveAll() {
      this.showConfirmationModal({
        title: 'Resolve all comments',
        message: 'Are you sure you want to resolve all comments?',
        action: () => this.$emit('resolve'),
        ...this.onConfirmationActive()
      });
    },
    onConfirmationActive() {
      const onOpen = () => this.$emit('update:confirmationActive', true);
      const onClose = () => this.$emit('update:confirmationActive', false);
      return { onOpen, onClose };
    }
  },
  watch: {
    commentsCount() {
      this.$emit('change', this.thread);
    },
    isVisible: {
      immediate: true,
      handler(val) {
        if (!val && this.isActivityThread) return;
        // Focus comment input manually with delay to avoid
        // element focus prioritization (e.g HTML element)
        setTimeout(() => this.$refs.commentInput.focus(), 500);
      }
    }
  },
  created() {
    this.comment = initCommentInput();
  },
  components: {
    DiscussionThread,
    ResolveButton
  }
};
</script>

<style lang="scss" scoped>
.embedded-discussion {
  font-family: Roboto, Arial, sans-serif;

  .resolve-btn-container {
    display: flex;
    justify-content: flex-end;
    margin: 0.5rem 0 0;
  }

  .header {
    margin: 0.875rem 0 1.625rem;
    font-size: 1.125rem;
    font-weight: 400;
  }

  .comment-input {
    margin: 0 0.25rem;
  }

  .alert ::v-deep .v-icon {
    color: var(--v-primary-darken2) !important;
  }
}
</style>
