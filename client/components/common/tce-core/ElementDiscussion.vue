<template>
  <v-menu
    v-model="isVisible"
    @click.native.stop
    :close-on-content-click="false"
    min-width="300"
    transition="slide-y-transition"
    left offset-y attach>
    <template v-slot:activator="{ on: menu }">
      <v-tooltip open-delay="800" left>
        <template v-slot:activator="{ on: tooltip }">
          <v-btn
            v-on="{ ...menu, ...tooltip }"
            :class="activator.class"
            x-small icon>
            <div v-if="activator.text" class="unseen">{{ activator.text }}</div>
            <v-icon v-else :color="activator.color" size="18">
              {{ activator.icon }}
            </v-icon>
          </v-btn>
        </template>
        <span>{{ activator.tooltip }}</span>
      </v-tooltip>
    </template>
    <discussion-resolve v-if="!isResolved" :comments="comments" />
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
import DiscussionResolve from './Discussion/Resolve';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import { mapChannels } from '@/plugins/radio';

const getActivatorOptions = unseenComments => ({
  unseen: {
    class: 'teal accent-4 white--text',
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
    color: 'blue-grey darken-4',
    tooltip: 'Post a comment'
  }
});

export default {
  name: 'element-discussion',
  props: {
    id: { type: Number, default: null },
    uid: { type: String, required: true },
    comments: { type: Array, required: true },
    isResolved: { type: Boolean, default: false },
    lastSeen: { type: Number, required: true },
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
        return it.author.id !== user.id && createdAt > lastSeen;
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
      const { uid: elementUid, lastCommentAt, events } = this;
      const options = { elementUid, lastCommentAt, timeout };
      this.editorBus.emit(events.SET_LAST_SEEN, options);
    }
  },
  watch: {
    isVisible(val) {
      if (!val || !this.lastCommentAt) return;
      this.setLastSeen(1000);
    },
    comments(val, oldVal) {
      if (!this.isVisible || isEqual(val, oldVal)) return;
      this.setLastSeen(2000);
    }
  },
  provide() {
    return { $editorBus: this.editorBus };
  },
  components: { Discussion, DiscussionResolve }
};
</script>

<style lang="scss" scoped>
.v-menu__content {
  background: #fff;

  ::v-deep .embedded-discussion {
    text-align: left;
  }

  ::v-deep .comment .author {
    font-size: 0.875rem;
  }
}

.unseen {
  font-size: 0.75rem;
}
</style>
