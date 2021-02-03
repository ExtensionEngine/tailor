<template>
  <div ref="discussion" class="embedded-discussion">
    <resolve-button v-if="showResolveButton" @click="$emit('resolve')" />
    <div :class="{ 'pb-7': !showHeading && hasHiddenComments }">
      <v-btn
        v-if="hasHiddenComments"
        @click="showAll = !showAll"
        text x-small
        class="float-right mt-1">
        Show {{ showAll ? 'less' : 'more' }}
      </v-btn>
    </div>
    <div v-if="showHeading" class="header grey--text text--darken-3">
      <v-icon color="grey darken-2" class="pr-1">mdi-forum-outline</v-icon>
      Comments
    </div>
    <v-alert
      v-if="!commentsCount && showNotifications"
      color="blue-grey darken-3"
      icon="mdi-chat"
      prominent text>
      Be the First to Comment!
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
    <div ref="editor" class="text-right">
      <v-textarea
        v-model.trim="comment.content"
        @focus="$emit('seen')"
        :placeholder="commentsCount ? 'Add a comment...' : 'Start the discussion...'"
        rows="3"
        outlined auto-grow clearable counter
        class="comment-editor" />
      <v-btn @click="post" :disabled="isTextEditorEmpty" icon>
        <v-icon>mdi-send</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import DiscussionThread from './Thread';
import { mapRequests } from '@/plugins/radio';
import orderBy from 'lodash/orderBy';
import ResolveButton from './ResolveButton';

const initCommentInput = () => ({ content: '' });

export default {
  name: 'embedded-discussion',
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
    user: { type: Object, required: true }
  },
  data: () => ({
    showAll: false,
    comment: initCommentInput()
  }),
  computed: {
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
    discussion: vm => vm.$refs.discussion,
    editor: vm => vm.$refs.editor,
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
      this.$nextTick(() => this[scrollTarget].scrollIntoView(scrollOptions));
    },
    remove(comment) {
      this.showConfirmationModal({
        title: 'Remove comment',
        message: 'Are you sure you want to remove this comment?',
        action: () => this.$emit('remove', comment),
        onOpen: () => this.$emit('update:confirmationActive', true),
        onClose: () => this.$emit('update:confirmationActive', false)
      });
    }
  },
  watch: {
    commentsCount() {
      this.$emit('change', this.thread);
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
    margin: 0.5rem 0 0 0;
  }

  .header {
    margin: 0.875rem 0 1.625rem 0;
    font-size: 1.125rem;
    font-weight: 400;
  }

  .comment-editor {
    margin: 0 0.25rem 0 0.25rem;
  }
}
</style>
