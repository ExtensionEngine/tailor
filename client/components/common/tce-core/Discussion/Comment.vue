<template>
  <div>
    <div v-if="showUnseenSeparator" class="unseen-separator">
      <v-divider class="my-3" />
      <v-chip @click="showSeenMarker = !showSeenMarker" small outlined>
        Unseen
      </v-chip>
      <div class="d-flex justify-center">
        <transition name="slide-fade">
          <v-btn
            v-if="showSeenMarker"
            @click="markSeen"
            color="teal"
            text x-small
            class="seen-marker">
            <v-icon class="mr-1" x-small>mdi-check</v-icon>
            Mark All as Seen
          </v-btn>
        </transition>
      </div>
    </div>
    <li class="comment">
      <v-avatar size="34" class="comment-avatar">
        <img :src="author.imgUrl">
      </v-avatar>
      <div class="comment-body pl-3">
        <div class="header">
          <span class="author">
            {{ author.fullName || author.email }}
            <v-icon v-if="isEdited" size="16" class="ml-1 pb-1">
              mdi-pencil-outline
            </v-icon>
          </span>
        </div>
        <text-editor
          v-model="content"
          :is-focused="isEditing"
          :show-preview="!isEditing"
          class="content" />
        <span v-if="isEditing" class="float-right">
          <v-btn @click="reset" text small>Cancel</v-btn>
          <v-btn @click="save" :disabled="!content.trim()" color="green" text small>
            <v-icon class="pr-1">mdi-check</v-icon> Save
          </v-btn>
        </span>
        <div v-else class="footer">
          <v-tooltip right>
            <template v-slot:activator="{ on }">
              <span v-on="on">
                <timeago
                  :datetime="comment.createdAt"
                  :auto-update="60"
                  class="time" />
              </span>
            </template>
            <span>{{ comment.createdAt | formatDate('M/D/YY h:mm A') }}</span>
          </v-tooltip>
          <v-tooltip left>
            <template v-slot:activator="{ on }">
              <v-btn
                v-if="elementTag"
                v-on="on"
                @click="toggleElementDiscussion"
                color="teal"
                text x-small>
                {{ 'Element Discussion' | truncate(12) }}
                <v-icon x-small class="ml-1">mdi-arrow-top-right-thick</v-icon>
              </v-btn>
            </template>
            <span>Toggle discussion</span>
          </v-tooltip>
        </div>
      </div>
      <v-menu v-if="showOptions" bottom left offset-y>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon x-small>
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item
            v-for="{ name, action, icon } in options"
            :key="name"
            @mousedown.prevent="action">
            <v-list-item-title class="text-left">
              <v-icon small class="pr-1">{{ icon }}</v-icon>
              {{ name }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </li>
  </div>
</template>

<script>
import events from '../Events/DiscussionEvent';
import { focus } from 'vue-focus';
import { mapChannels } from '@/plugins/radio';
import TextEditor from './TextEditor';

const getRouteOptions = ({ id: commentId, activityId, contentElement }) => ({
  name: 'editor',
  params: { activityId },
  query: { elementId: contentElement.uid, commentId }
});

export default {
  name: 'thread-comment',
  props: {
    comment: { type: Object, required: true },
    user: { type: Object, required: true },
    showAllComments: { type: Boolean, default: false },
    unseenComments: { type: Array, default: () => [] },
    seenMarker: { type: Boolean, default: false }
  },
  data: vm => ({
    content: vm.comment.content,
    isEditing: false,
    showSeenMarker: false
  }),
  computed: {
    ...mapChannels({ editorBus: 'editor' }),
    author: vm => vm.comment.author,
    isEdited: vm => vm.comment.createdAt !== vm.comment.updatedAt,
    isDeleted: vm => !!vm.comment.deletedAt,
    isAuthor: vm => vm.author.id === vm.user.id,
    showOptions: vm => vm.isAuthor && !vm.isDeleted,
    options: vm => [
      { name: 'Edit', action: vm.toggleEdit, icon: 'mdi-pencil' },
      { name: 'Remove', action: vm.remove, icon: 'mdi-delete' }],
    elementTag: vm => vm.showAllComments && vm.comment.contentElementId,
    showUnseenSeparator() {
      const { seenMarker, unseenComments, comment } = this;
      return seenMarker && unseenComments[0]?.id === comment.id;
    }
  },
  methods: {
    toggleEdit() {
      this.isEditing = !this.isEditing;
    },
    save() {
      if (!this.content) return;
      this.toggleEdit();
      this.$emit('update', this.comment, this.content);
    },
    remove() {
      this.$emit('remove', this.comment);
    },
    reset() {
      this.content = this.comment.content;
      this.isEditing = false;
    },
    markSeen() {
      this.editorBus.emit(events.SET_LAST_SEEN);
    },
    toggleElementDiscussion() {
      const { commentId } = this.$route.query;
      if (parseInt(commentId, 10) === this.comment.commentId) return;
      const routeOpts = getRouteOptions(this.comment);
      const isEditor = this.$route.name === 'editor';
      if (!isEditor) this.$router.push(routeOpts);
      this.editorBus.emit(events.TOGGLE, routeOpts.query);
    }
  },
  watch: {
    comment: {
      deep: true,
      handler: 'reset'
    }
  },
  directives: { focus },
  components: { TextEditor }
};
</script>

<style lang="scss" scoped>
.unseen-separator {
  text-align: center;

  ::v-deep .v-chip.v-chip--outlined.theme--light {
    margin-top: -3rem;
    border-radius: 0.75rem !important;
    background-color: #fff !important;
  }

  .seen-marker {
    margin-top: -0.875rem;
    margin-bottom: 0.5rem;
  }

  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateX(0.625rem);
    opacity: 0;
  }
}

.comment {
  display: flex;
  margin-bottom: 1.25rem;
  font-family: Roboto, Arial, sans-serif;

  &-avatar {
    width: 2.5rem;
    margin-top: 0.375rem;
    overflow: hidden;
  }

  &-body {
    flex: 1;
  }

  .author {
    font-size: 1rem;
  }

  .content {
    margin: 0.375rem 0 0 0;
  }

  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .time {
    color: #888;
    font-size: 0.75rem;
  }
}

.v-menu__content {
  cursor: pointer !important;
}
</style>
