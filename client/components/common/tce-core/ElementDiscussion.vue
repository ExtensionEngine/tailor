<template>
  <v-menu
    v-model="isVisible"
    :close-on-content-click="false"
    transition="slide-y-transition"
    min-width="300"
    attach offset-y left>
    <template v-slot:activator="{ on: menu }">
      <v-tooltip open-delay="800" left>
        <template v-slot:activator="{ on: tooltip }">
          <v-btn v-on="{ ...menu, ...tooltip }" icon>
            <v-avatar v-if="unseenComments.length" size="18" color="secondary">
              {{ unseenComments.length }}
            </v-avatar>
            <v-icon v-else color="primary" class="pr-1">mdi-forum-outline</v-icon>
          </v-btn>
        </template>
        <span>{{ tooltipLabel }}</span>
      </v-tooltip>
    </template>
    <discussion
      @save="save"
      @update="save"
      @remove="editorBus.emit(events.REMOVE, $event)"
      v-bind="{ comments, user }"
      show-heading
      class="pa-4" />
  </v-menu>
</template>

<script>
import Discussion from 'tce-core/Discussion';
import DiscussionEvent from './Events/DiscussionEvent';
import get from 'lodash/get';
import { mapChannels } from '@/plugins/radio';

export default {
  name: 'element-discussion',
  props: {
    id: { type: Number, required: true },
    uid: { type: String, required: true },
    comments: { type: Array, required: true },
    lastSeen: { type: Number, required: true },
    user: { type: Object, required: true }
  },
  data: () => ({ isVisible: false }),
  computed: {
    ...mapChannels({ editorBus: 'editor' }),
    events: () => DiscussionEvent,
    tooltipLabel: vm => vm.comments.length ? 'View comments' : 'Post a comment',
    lastCommentAt: vm => new Date(get(vm.comments[0], 'createdAt', 0)).getTime(),
    unseenComments() {
      const { comments, user, lastSeen } = this;
      return comments.filter(it => (
        it.author.id !== user.id &&
        new Date(it.createdAt).getTime() > lastSeen
      ));
    }
  },
  methods: {
    save(data) {
      const { editorBus, user: author, id: elementId, events } = this;
      return editorBus.emit(events.SAVE, {
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
      if (!this.isVisible || val === oldVal) return;
      this.setLastSeen(2000);
    }
  },
  components: { Discussion }
};
</script>

<style lang="scss" scoped>
$background-color: #fff;

.v-menu__content {
  background: $background-color;

  ::v-deep .embedded-discussion {
    text-align: left;
  }
}

.v-btn.v-btn--icon {
  position: absolute;
  top: 2rem;
  right: -1.125rem;
  z-index: 2;
  background: $background-color;

  ::v-deep .v-avatar {
    color: $background-color;
    font-size: 0.75rem;
  }
}
</style>
