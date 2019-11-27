<template>
  <li class="comment">
    <v-avatar size="34" class="comment-avatar">
      <img :src="author.imgUrl">
    </v-avatar>
    <div class="comment-body pl-3">
      <div class="header">
        <span class="author">{{ author.fullName || author.email }}</span>
        <v-icon v-if="isEdited" size="16" class="ml-1">
          mdi-pencil-outline
        </v-icon>
      </div>
      <text-editor
        @blur="update"
        @change="update"
        :value="comment.content"
        :focused="isEditing"
        :preview="!isEditing"
        class="content" />
      <timeago
        v-if="!isEditing"
        :datetime="comment.createdAt"
        :auto-update="60"
        class="time" />
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
import { focus } from 'vue-focus';
import { mapState } from 'vuex';
import TextEditor from './TextEditor';

export default {
  name: 'thread-comment',
  props: {
    comment: { type: Object, required: true }
  },
  data: () => ({ isEditing: false }),
  computed: {
    ...mapState({ user: state => state.auth.user }),
    author: vm => vm.comment.author,
    isEdited: vm => vm.comment.createdAt !== vm.comment.updatedAt,
    isDeleted: vm => !!vm.comment.deletedAt,
    isAuthor: vm => vm.author.id === vm.user.id,
    showOptions: vm => vm.isAuthor && !vm.isDeleted,
    options() {
      return [
        { name: 'Edit', action: this.toggleEdit, icon: 'mdi-pencil' },
        { name: 'Remove', action: this.remove, icon: 'mdi-delete' }
      ];
    }
  },
  methods: {
    update(content) {
      this.isEditing = false;
      if (!content || content === this.comment.content) return;
      this.$emit('update', this.comment, content);
    },
    remove() {
      this.$emit('remove', this.comment);
    },
    toggleEdit() {
      this.isEditing = !this.isEditing;
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

  &-avatar {
    width: 2.5rem;
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
