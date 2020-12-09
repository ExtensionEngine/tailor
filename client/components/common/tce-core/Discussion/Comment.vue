<template>
  <li class="comment">
    <v-avatar size="34" class="comment-avatar">
      <img :src="author.imgUrl">
      <v-btn v-if="elementTag" @click="toggleElementDiscussion" icon>CE</v-btn>
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
      <v-tooltip v-else right>
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
</template>

<script>
import events from '../Events/DiscussionEvent';
import { focus } from 'vue-focus';
import { mapChannels } from '@/plugins/radio';
import TextEditor from './TextEditor';

export default {
  name: 'thread-comment',
  props: {
    comment: { type: Object, required: true },
    user: { type: Object, required: true },
    showAllComments: { type: Boolean, default: false }
  },
  data: vm => ({ isEditing: false, content: vm.comment.content }),
  computed: {
    ...mapChannels({ editorBus: 'editor' }),
    author: vm => vm.comment.author,
    isEdited: vm => vm.comment.createdAt !== vm.comment.updatedAt,
    isDeleted: vm => !!vm.comment.deletedAt,
    isAuthor: vm => vm.author.id === vm.user.id,
    showOptions: vm => vm.isAuthor && !vm.isDeleted,
    elementTag: vm => vm.showAllComments && vm.comment.contentElementId,
    options: vm => [
      { name: 'Edit', action: vm.toggleEdit, icon: 'mdi-pencil' },
      { name: 'Remove', action: vm.remove, icon: 'mdi-delete' }]
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
    toggleElementDiscussion() {
      const { uid: elementUid } = this.comment.contentElement;
      this.editorBus.emit(events.TOGGLE, elementUid);
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
.comment {
  display: flex;
  margin-bottom: 1.25rem;
  font-family: Roboto, Arial, sans-serif;

  &-avatar {
    width: 2.5rem;
    margin-top: 0.375rem;
    overflow: visible;
  }

  &-avatar ::v-deep .v-btn {
    position: absolute;
    top: -0.125rem;
    left: -0.375rem;
    width: 1.25rem;
    height: 1.25rem;
    background: var(--v-primary-darken3);

    .v-btn__content {
      color: rgb(255, 87, 34);
      font-size: 0.625rem;
    }
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

  .time {
    color: #888;
    font-size: 0.75rem;
  }
}

.v-menu__content {
  cursor: pointer !important;
}
</style>
