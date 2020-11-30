<template>
  <div :ref="`ce:${contentElement.uid}`" class="content-element-discussion">
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
  </div>
</template>

<script>
import Discussion from 'tce-core/Discussion';
import discussionMixin from './common';
import { mapChannels } from '@/plugins/radio';
import { mapGetters } from 'vuex';

export default {
  name: 'content-element-discussion',
  mixins: [discussionMixin],
  props: {
    activity: { type: Object, required: true },
    contentElement: { type: Object, required: true },
    showHeading: { type: Boolean, default: true }
  },
  data: () => ({
    showDiscussion: false,
    unseenCommentCount: 0
  }),
  computed: {
    ...mapChannels({ editorChannel: 'editor' }),
    ...mapGetters('repository/comments', ['getUnseenComments']),
    unseenComments: vm => vm.getUnseenComments(vm.activity, vm.contentElement)
  },
  methods: {
    toggleDiscussion(query) {
      const { elementId } = this.$route.query;
      if (!elementId && query) this.$router.push({ query });
      if (this.contentElement.uid !== elementId) return;
      const contentElement = this.$refs[`ce:${elementId}`];
      contentElement.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => (this.showDiscussion = true), 200);
    }
  },
  watch: {
    showDiscussion(val) {
      if (!val || !this.lastCommentAt) return;
      this.setLastSeenComment(1000, this.unseenComments);
    },
    comments(val, oldVal) {
      if (!this.showDiscussion || val === oldVal) return;
      this.setLastSeenComment(2000, this.unseenComments);
    },
    unseenComments(comments) {
      if (this.showDiscussion && comments.length) return;
      setTimeout(() => (this.unseenCommentCount = comments.length), 200);
    }
  },
  mounted() {
    this.toggleDiscussion();
    this.editorChannel.on('element:toggle-discussion', contentElementUid => {
      this.toggleDiscussion({ elementId: contentElementUid });
    });
  },
  components: { Discussion }
};
</script>

<style lang="scss" scoped>
$white: #fff;

.content-element-discussion {
  position: relative;
}

.v-menu__content {
  background: $white;
}

.v-btn {
  position: absolute;
  top: 2rem;
  right: -2.375rem;
  z-index: 2;
  background: $white;

  .v-btn__content {
    position: relative;
  }
}

::v-deep {
  .embedded-discussion .header {
    text-align: left;
  }

  .v-badge {
    position: absolute;
    top: 0.375rem;
    right: 1.5rem;
  }
}
</style>
