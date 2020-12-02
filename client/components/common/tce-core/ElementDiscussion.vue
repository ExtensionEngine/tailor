<template>
  <v-menu
    v-model="showDiscussion"
    :close-on-content-click="false"
    transition="slide-y-transition"
    min-width="300"
    attach offset-y left>
    <template v-slot:activator="{ on: menu }">
      <v-tooltip open-delay="800" left>
        <template v-slot:activator="{ on: tooltip }">
          <v-btn v-on="{ ...menu, ...tooltip }" icon>
            <v-badge
              v-if="unseenCommentCount"
              :content="unseenCommentCount"
              color="secondary" />
            <v-icon v-else color="primary" class="pr-1">mdi-forum-outline</v-icon>
          </v-btn>
        </template>
        <span>Discussion</span>
      </v-tooltip>
    </template>
    <discussion
      @save="save"
      @update="save"
      @remove="elementBus.emit('comment:remove', $event);"
      v-bind="{ comments, user, showHeading }"
      class="pa-4" />
  </v-menu>
</template>

<script>
import Discussion from 'tce-core/Discussion';

const EVENTS = {
  INIT: 'comments:init',
  SET_LAST_SEEN: 'comment:set-last-seen'
};

export default {
  name: 'content-element-discussion',
  inject: ['$getCurrentUser'],
  props: {
    element: { type: Object, required: true },
    showHeading: { type: Boolean, default: true }
  },
  data: () => ({
    comments: {},
    unseenComments: [],
    lastCommentAt: 0,
    unseenCommentCount: 0,
    showDiscussion: false
  }),
  computed: {
    elementBus: vm => vm.$radio.channel(`element:${vm.element.id}`),
    user: vm => vm.$getCurrentUser()
  },
  methods: {
    save(data) {
      const { elementBus, user: author } = this;
      return elementBus.emit('comment:save', { ...data, author });
    }
  },
  watch: {
    showDiscussion(val) {
      if (!val || !this.lastCommentAt) return;
      this.elementBus.emit(EVENTS.SET_LAST_SEEN, 1000);
    },
    comments(val, oldVal) {
      if (!this.showDiscussion || val === oldVal) return;
      this.elementBus.emit(EVENTS.SET_LAST_SEEN, 2000);
    },
    unseenComments(comments) {
      if (this.showDiscussion && comments.length) return;
      setTimeout(() => (this.unseenCommentCount = comments.length), 200);
    }
  },
  created() {
    this.elementBus.on(EVENTS.INIT, data => Object.assign(this, data));
  },
  provide() {
    return { $elementBus: this.elementBus };
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

.v-btn {
  position: absolute;
  top: 2rem;
  right: -1.125rem;
  z-index: 2;
  background: $background-color;

  .v-btn__content {
    position: relative;
  }

  ::v-deep .v-badge {
    position: absolute;
    top: 0.375rem;
    right: 1.5rem;
  }
}
</style>
