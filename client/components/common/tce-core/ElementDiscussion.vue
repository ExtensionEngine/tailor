<template>
  <v-menu
    :ref="`element:${uid}`"
    v-model="isVisible"
    :close-on-content-click="false"
    transition="slide-y-transition"
    min-width="300"
    attach offset-y left>
    <template v-slot:activator="{ on: menu }">
      <v-tooltip open-delay="800" left>
        <template v-slot:activator="{ on: tooltip }">
          <v-btn
            v-on="{ ...menu, ...tooltip }"
            :class="{ unseen: commentActivator.text }"
            :ripple="false"
            x-small icon>
            <span v-if="commentActivator.text">{{ commentActivator.text }}</span>
            <v-icon v-else :color="commentActivator.color">
              {{ commentActivator.icon }}
            </v-icon>
          </v-btn>
        </template>
        <span>{{ commentActivator.tooltip }}</span>
      </v-tooltip>
    </template>
    <discussion
      @save="save"
      @update="save"
      @remove="editorBus.emit(events.REMOVE, $event)"
      v-bind="{ comments, user }"
      class="px-3 py-2" />
  </v-menu>
</template>

<script>
import Discussion from 'tce-core/Discussion';
import DiscussionEvent from './Events/DiscussionEvent';
import get from 'lodash/get';
import { mapChannels } from '@/plugins/radio';

const getActivatorOptions = unseenComments => ({
  preview: {
    icon: 'mdi-comment-text-multiple',
    color: 'primary',
    tooltip: 'View comments',
    text: unseenComments.length
  },
  post: {
    icon: 'mdi-message-plus-outline',
    color: 'teal',
    tooltip: 'Post a comment'
  }
});

export default {
  name: 'element-discussion',
  props: {
    id: { type: Number, default: null },
    uid: { type: String, required: true },
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
    commentActivator() {
      const { comments, unseenComments } = this;
      const type = comments.length ? 'preview' : 'post';
      return getActivatorOptions(unseenComments)[type];
    },
    routeElementId: vm => vm.$route.query?.elementId
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
      const { $router, uid } = this;
      if (query && this.routeElementId !== query.elementId) $router.push({ query });
      if (uid !== this.routeElementId) return;
      const element = this.$refs[`element:${uid}`].$el;
      element.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => (this.isVisible = true), 200);
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
  mounted() {
    this.toggleDiscussion();
    const { editorBus, events } = this;
    editorBus.on(events.TOGGLE, elementUid => {
      this.toggleDiscussion({ elementId: elementUid });
    });
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

  &.unseen {
    width: 1rem;
    height: 1rem;
    color: #fff;
    background: var(--v-secondary-base);
  }
}
</style>
