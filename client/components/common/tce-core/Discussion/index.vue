<template>
  <div class="embedded-discussion">
    <div :class="{ 'pb-7': !showHeading && showAllToggle }">
      <v-btn
        v-if="showAllToggle"
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
      @remove="$emit('remove', $event)"
      :items="thread"
      :user="user"
      :min-displayed="commentsShownLimit"
      :show-all="showAll"
      class="mt-2" />
    <div class="text-right">
      <text-editor
        ref="editor"
        v-model="comment.content"
        @change="post"
        :placeholder="commentsCount ? 'Add a comment...' : 'Start the discussion...'" />
      <v-btn @click="post" icon>
        <v-icon>mdi-send</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import DiscussionThread from './Thread';
import orderBy from 'lodash/orderBy';
import TextEditor from './TextEditor';

const initCommentInput = () => ({ content: '' });

export default {
  name: 'embedded-discussion',
  inheritAttrs: true,
  props: {
    comments: { type: Array, default: () => [] },
    user: { type: Object, required: true },
    showHeading: { type: Boolean, default: false },
    showNotifications: { type: Boolean, default: false }
  },
  data: () => ({ showAll: false, comment: initCommentInput() }),
  computed: {
    thread: vm => orderBy(vm.comments, ['createdAt'], ['asc']),
    commentsCount: vm => vm.thread.length,
    commentsShownLimit: vm => 5,
    showAllToggle: vm => vm.commentsShownLimit < vm.thread.length,
    editor: vm => vm.$refs.editor.$el
  },
  methods: {
    async post() {
      if (!this.comment.content) return;
      const payload = {
        content: this.comment.content,
        author: this.user,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      this.comment = initCommentInput();
      this.$emit('save', payload);
      // Keep editor inside viewport.
      this.$nextTick(() => this.editor.scrollIntoView());
    }
  },
  watch: {
    commentsCount() {
      this.$emit('change', this.thread);
    }
  },
  async created() {
    this.comment = initCommentInput();
  },
  components: {
    DiscussionThread,
    TextEditor
  }
};
</script>

<style lang="scss" scoped>
.embedded-discussion {
  font-family: Roboto, Arial, sans-serif;
}

.header {
  margin: 0.875rem 0 1.625rem 0;
  font-size: 1.125rem;
  font-weight: 400;
}
</style>
