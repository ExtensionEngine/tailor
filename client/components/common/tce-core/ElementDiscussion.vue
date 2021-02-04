<template>
  <v-menu
    v-model="isVisible"
    @click.native.stop
    :close-on-content-click="false"
    :close-on-click="!isConfirmationActive"
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
    <discussion
      @save="save"
      @update="save"
      @remove="editorBus.emit(events.REMOVE, $event)"
      @seen="setLastSeen"
      @resolve="resolve"
      v-bind="{ comments, unseenComments, hasUnresolvedComments, user }"
      :confirmation-active.sync="isConfirmationActive"
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
    hasUnresolvedComments: { type: Boolean, default: false },
    lastSeen: { type: Number, required: true },
    user: { type: Object, required: true }
  },
  data: () => ({
    isVisible: false,
    isConfirmationActive: false
  }),
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
      const { user: author, id: elementId, hasUnresolvedComments } = this;
      return this.editorBus.emit(DiscussionEvent.SAVE, {
        ...data,
        author,
        contentElementId: elementId,
        hasUnresolvedComments
      });
    },
    setLastSeen(timeout) {
      const { uid: elementUid, lastCommentAt, events } = this;
      const options = { elementUid, lastCommentAt, timeout };
      this.editorBus.emit(events.SET_LAST_SEEN, options);
    },
    resolve({ id, resolvedAt } = {}) {
      const { id: contentElementId, events } = this;
      this.editorBus.emit(events.RESOLVE, { id, contentElementId, resolvedAt });
    }
  },
  watch: {
    isVisible(val) {
      const { elementId } = this.$route.query;
      if (!val || elementId === this.uid) return;
      const query = { elementId: this.uid };
      this.$router.push({ query });
    }
  },
  components: { Discussion }
};
</script>

<style lang="scss" scoped>
::v-deep .v-menu__content {
  background: #fff;

  .embedded-discussion {
    text-align: left;
  }

  .comment .author {
    font-size: 0.875rem;
  }
}

.unseen {
  font-size: 0.75rem;
}
</style>
