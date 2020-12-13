<template>
  <v-menu
    v-if="isElementSelected || comments.length"
    v-model="isVisible"
    :close-on-content-click="false"
    transition="slide-y-transition"
    min-width="300"
    left offset-y attach>
    <template v-slot:activator="{ on: menu }">
      <v-tooltip open-delay="800" left>
        <template v-slot:activator="{ on: tooltip }">
          <v-btn
            v-on="{ ...menu, ...tooltip }"
            :class="activator.class"
            x-small icon>
            <div v-if="activator.text" class="unseen">{{ activator.text }}</div>
            <v-icon v-else :color="activator.color">{{ activator.icon }}</v-icon>
          </v-btn>
        </template>
        <span>{{ activator.tooltip }}</span>
      </v-tooltip>
    </template>
    <discussion
      @save="save"
      @update="save"
      @remove="editorBus.emit(events.REMOVE, $event)"
      v-bind="{ comments, user }"
      class="pa-2" />
  </v-menu>
</template>

<script>
import Discussion from 'tce-core/Discussion';
import DiscussionEvent from './Events/DiscussionEvent';
import get from 'lodash/get';
import { mapChannels } from '@/plugins/radio';

const getActivatorOptions = unseenComments => ({
  unseen: {
    class: 'pink white--text',
    tooltip: 'View new comments',
    text: unseenComments.length
  },
  preview: {
    icon: 'mdi-comment-text-multiple-outline',
    color: 'blue-grey darken-4',
    tooltip: 'View comments'
  },
  post: {
    icon: 'mdi-message-plus-outline',
    color: 'teal accent-4',
    tooltip: 'Post a comment'
  }
});

export default {
  name: 'element-discussion',
  props: {
    id: { type: Number, default: null },
    uid: { type: String, required: true },
    isElementSelected: { type: Boolean, default: false },
    comments: { type: Array, required: true },
    lastSeen: { type: Object, required: true },
    user: { type: Object, required: true }
  },
  data: () => ({ isVisible: false }),
  computed: {
    ...mapChannels({ editorBus: 'editor' }),
    events: () => DiscussionEvent,
    lastCommentAt: vm => new Date(get(vm.comments[0], 'createdAt', 0)).getTime(),
    unseenComments() {
      const { comments, user, lastSeen } = this;
      return comments.filter(it => {
        const createdAt = new Date(it.createdAt).getTime();
        return it.author.id !== user.id &&
          createdAt > lastSeen.element &&
          createdAt > lastSeen.activity;
      });
    },
    activator() {
      const { comments, unseenComments } = this;
      const type = unseenComments.length
        ? 'unseen'
        : (comments.length ? 'preview' : 'post');
      return getActivatorOptions(unseenComments)[type];
    }
  },
  methods: {
    save(data) {
      const { editorBus, user: author, id: elementId } = this;
      return editorBus.emit(DiscussionEvent.SAVE, {
        ...data,
        author,
        contentElementId: elementId
      });
    },
    setLastSeen(timeout) {
      const { uid: elementUid, lastCommentAt, unseenComments, events } = this;
      const options = {
        elementUid,
        lastCommentAt,
        timeout,
        unseenElementComments: unseenComments
      };
      this.editorBus.emit(events.SET_LAST_SEEN, options);
    },
    toggleDiscussion(query) {
      const { uid, comments, $router, $route } = this;
      if (!comments.length) return;
      const timeout = $route.query.commentId ? 200 : 0;
      setTimeout(() => {
        const { elementId, commentId } = query;
        if (uid !== elementId) return;
        this.isVisible = true;
        if (commentId) $router.push({ query });
      }, timeout);
    }
  },
  watch: {
    isVisible(val) {
      const { commentId, elementId } = this.$route.query;
      if (!val && commentId) {
        const query = elementId ? { elementId } : {};
        this.$router.replace({ query });
      }
      if (!val || !this.lastCommentAt) return;
      this.setLastSeen(1000);
    },
    comments(val, oldVal) {
      if (!this.isVisible || val === oldVal) return;
      this.setLastSeen(2000);
    }
  },
  created() {
    const { editorBus, events } = this;
    const { commentId, elementId } = this.$route.query;
    if (commentId) this.toggleDiscussion({ elementId });
    editorBus.on(events.TOGGLE, query => this.toggleDiscussion(query));
  },
  components: { Discussion }
};
</script>

<style lang="scss" scoped>
.v-menu__content {
  background: #fff;

  ::v-deep .embedded-discussion {
    text-align: left;
  }
}

.unseen {
  font-size: 0.75rem;
}
</style>
