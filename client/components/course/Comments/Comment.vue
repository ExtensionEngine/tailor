<template>
  <li
    @mouseover="hovered = true"
    @mouseleave="hovered = false">
    <v-list-tile>
      <v-list-tile-avatar>
        <avatar
          :size="40"
          :username="author.email"
          :initials="authorInitials"
          color="#ffffff">
        </avatar>
      </v-list-tile-avatar>
      <v-list-tile-content>
        <v-list-tile-title :class="{ 'current-user': isAuthor }" class="author">
          {{ author.email }}
          <slot name="new-comment"></slot>
          <span v-if="isEdited" class="edited-icon icon mdi mdi-pencil"></span>
        </v-list-tile-title>
        <v-list-tile-sub-title>
          <text-editor
            :value="content"
            :focused="editing"
            :preview="!editing"
            :class="{ deleted: isDeleted }"
            @blur="update"
            @change="update"
            class="content">
          </text-editor>
        </v-list-tile-sub-title>
      </v-list-tile-content>
      <v-list-tile-action>
        <v-list-tile-action-text>
          <timeago :since="createdAt" :auto-update="60"></timeago>
          <v-menu
            offset-y
            bottom
            left
            attach
            open-on-hover
            transition="slide-y-transition"
            content-class="elevation-2">
            <template v-slot:activator="{ on }">
              <v-btn v-if="showActions" v-on="on" icon small>
                <span class="icon mdi mdi-dots-vertical"></span>
              </v-btn>
            </template>
            <v-list class="actions">
              <v-list-tile @click="toggleEdit">
                <v-list-tile-title class="action">
                  <span class="icon mdi mdi-pencil"></span> Edit
                </v-list-tile-title>
              </v-list-tile>
              <v-list-tile @click="remove">
                <v-list-tile-title class="action">
                  <span class="icon mdi mdi-delete"></span> Remove
                </v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-list-tile-action-text>
      </v-list-tile-action>
    </v-list-tile>
  </li>
</template>

<script>
import Avatar from 'vue-avatar';
import { focus } from 'vue-focus';
import { mapGetters } from 'vuex-module';
import TextEditor from 'components/common/TextEditor';
import ThreadComment from './Comment';

export default {
  name: 'thread-comment',
  props: {
    author: { type: Object, required: true },
    content: { type: String, required: true },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
    deletedAt: { type: String, default: null },
    avatar: { type: Boolean, default: true }
  },
  data: () => ({
    editing: false,
    showDropdown: false,
    hovered: false
  }),
  computed: {
    ...mapGetters(['user']),
    authorInitials() {
      return this.author.email.substr(0, 2).toUpperCase();
    },
    isAuthor() {
      return this.author.id === this.user.id;
    },
    isEdited() {
      return this.createdAt !== this.updatedAt;
    },
    isDeleted() {
      return !!this.deletedAt;
    },
    showActions() {
      return this.hovered && this.isAuthor && !this.isDeleted;
    }
  },
  methods: {
    toggleEdit() {
      this.editing = !this.editing;
    },
    update(content) {
      this.editing = false;
      if (!content || content === this.content) return;
      this.$emit('update', content);
    },
    remove() {
      this.$emit('remove');
    }
  },
  directives: { focus },
  components: { Avatar, TextEditor, ThreadComment }
};
</script>

<style lang="scss" scoped>
$color: #333;
$color-light: lighten($color, 25%);
$avatar-size: 40px;
$font-size: 15px;
$line-size: 20px;

/deep/ .v-list__tile {
  height: 100%;
  padding: 0;
  align-items: flex-start;

  .v-list__tile__avatar {
    margin-top: 5px;
  }
}

.content {
  font-size: $font-size;
  line-height: $line-size;

  &.deleted /deep/ .content span {
    color: $color-light;
    font-weight: 400;
    font-style: italic;
  }
}

.author {
  color: $color-light;
  font-size: 14px;
  font-weight: 500;

  &.current-user {
    color: #0f47a1;
  }

  .edited-icon {
    color: $color-light;
    font-size: 12px;
  }
}

.v-list__tile__action-text {
  display: flex;
  line-height: 24px;

  .v-btn--icon {
    width: 24px;
    height: 24px;
    margin: 0 0 0 3px;
  }
}

.actions {
  padding: 3px 0;
  font-size: 12px;
  list-style: none;

  .action {
    padding: 0 5px;
    color: $color-light;
    font-size: 12px;

    &:hover {
      background: #e0e0e0;
    }
  }
}
</style>
