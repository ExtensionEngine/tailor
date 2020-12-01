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
      @save="saveComment"
      @update="saveComment"
      @remove="remove"
      v-bind="{ comments, user, showHeading }"
      class="pa-4" />
  </v-menu>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import Discussion from 'tce-core/Discussion';
import find from 'lodash/find';
import get from 'lodash/get';

const extractParams = ({ activity, contentElement }) => ({
  activityId: activity.id,
  contentElementId: contentElement ? contentElement.id : null
});

export default {
  name: 'content-element-discussion',
  inject: ['$getCurrentUser'],
  props: {
    contentElement: { type: Object, required: true },
    showHeading: { type: Boolean, default: true }
  },
  data: () => ({
    showDiscussion: false,
    unseenCommentCount: 0
  }),
  computed: {
    ...mapGetters('repository/comments', ['getUnseenComments', 'getComments']),
    ...mapGetters('repository/activities', ['activities']),
    user: vm => vm.$getCurrentUser(),
    activity() {
      const { activityId } = this.$route.params;
      return find(this.activities, { id: parseInt(activityId, 10) });
    },
    params: vm => extractParams(vm),
    comments: vm => vm.getComments(vm.params),
    lastCommentAt: vm => new Date(get(vm.comments[0], 'createdAt', 0)).getTime(),
    unseenComments: vm => vm.getUnseenComments(vm.activity, vm.contentElement)
  },
  methods: {
    ...mapActions('repository/comments', ['fetch', 'save', 'update', 'remove']),
    ...mapMutations('repository/comments', ['markSeenComments']),
    saveComment(comment) {
      const action = comment.id ? 'update' : 'save';
      const { user: author, params } = this;
      return this[action]({ ...comment, ...params, author });
    },
    setLastSeenComment(timeout) {
      const { contentElement, lastCommentAt } = this;
      const payload = { elementUid: contentElement.uid, lastCommentAt };
      setTimeout(() => this.markSeenComments(payload), timeout);
    }
  },
  watch: {
    showDiscussion(val) {
      if (!val || !this.lastCommentAt) return;
      this.setLastSeenComment(1000);
    },
    comments(val, oldVal) {
      if (!this.showDiscussion || val === oldVal) return;
      this.setLastSeenComment(2000);
    },
    unseenComments(comments) {
      if (this.showDiscussion && comments.length) return;
      setTimeout(() => (this.unseenCommentCount = comments.length), 200);
    }
  },
  created() {
    this.fetch(this.params);
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
