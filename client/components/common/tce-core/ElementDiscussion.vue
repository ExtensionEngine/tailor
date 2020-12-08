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
          <v-btn v-on="{ ...menu, ...tooltip }" :ripple="false" x-small icon>
            <v-avatar v-if="unseenComments.length" size="16" color="secondary">
              {{ unseenComments.length }}
            </v-avatar>
            <v-icon v-else :color="options.color">{{ options.icon }}</v-icon>
          </v-btn>
        </template>
        <span>{{ options.tooltip }}</span>
      </v-tooltip>
    </template>
    <discussion
      @save="save"
      @update="save"
      @remove="editorBus.emit(events.remove, $event)"
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

const options = {
  preview: {
    icon: 'mdi-comment-text-multiple',
    color: 'primary',
    tooltip: 'View comments'
  },
  post: {
    icon: 'mdi-message-plus-outline',
    color: 'teal',
    tooltip: 'Post a comment'
  }
};

export default {
  name: 'element-discussion',
  props: {
    id: { type: Number, default: null },
    uid: { type: String, required: true },
    comments: { type: Array, required: true },
    lastSeen: { type: Number, required: true },
    user: { type: Object, required: true }
  },
  data: () => ({ isVisible: false }),
  computed: {
    ...mapChannels({ editorBus: 'editor' }),
    events: () => DiscussionEvent,
    options: vm => vm.comments.length ? options.preview : options.post,
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
      return editorBus.emit(events.save, {
        ...data,
        author,
        contentElementId: elementId
      });
    },
    setLastSeen(timeout) {
      const { uid: elementUid, lastCommentAt, events } = this;
      const options = { elementUid, lastCommentAt, timeout };
      this.editorBus.emit(events.setLastSeen, options);
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
.v-menu__content {
  background: #fff;

  ::v-deep .embedded-discussion {
    text-align: left;
  }
}

.v-btn.v-btn--icon {
  position: absolute;
  top: 0.125rem;
  right: -1.5rem;
  z-index: 2;

  &::before {
    display: none;
  }

  ::v-deep .v-avatar {
    font-size: 0.625rem;
  }
}
</style>
