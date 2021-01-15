<template>
  <div class="header">
    <v-avatar size="34" class="comment-avatar">
      <img :src="author.imgUrl">
    </v-avatar>
    <div class="d-flex flex-column">
      <div class="d-block">
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <span v-on="on" class="author">{{ author.label | truncate(25) }}</span>
          </template>
          {{ author.label }}
        </v-tooltip>
        <span v-if="isEdited" class="edited">(edited)</span>
      </div>
      <div class="d-flex align-center">
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <span v-on="on">
              <timeago
                :datetime="comment.createdAt"
                :auto-update="60"
                class="time" />
            </span>
          </template>
          <span>{{ comment.createdAt | formatDate('DD. MMM h:mm A') }}</span>
        </v-tooltip>
        <v-divider vertical />
        <editor-link
          v-if="isActivityThread && elementLabel"
          :activity-id="comment.activityId"
          :element-uid="elementUid"
          :label="elementLabel" />
      </div>
    </div>
    <div v-if="showOptions" class="actions">
      <v-btn
        v-for="{ name, action, icon } in options"
        :key="name"
        @click="$emit(action)"
        x-small icon
        class="ml-1">
        <v-icon size="14" color="grey">{{ icon }}</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import EditorLink from 'tce-core/EditorLink';

export default {
  name: 'comment-header',
  props: {
    comment: { type: Object, required: true },
    user: { type: Object, required: true },
    isActivityThread: { type: Boolean, default: false },
    elementLabel: { type: String, default: null }
  },
  computed: {
    elementUid: vm => vm.comment.contentElement.uid,
    author: vm => vm.comment.author,
    isAuthor: vm => vm.author.id === vm.user.id,
    isEdited: vm => vm.comment.createdAt !== vm.comment.updatedAt,
    isDeleted: vm => !!vm.comment.deletedAt,
    showOptions: vm => vm.isAuthor && !vm.isDeleted,
    options: vm => [
      { name: 'Edit', action: 'toggleEdit', icon: 'mdi-pencil-outline' },
      { name: 'Remove', action: 'remove', icon: 'mdi-trash-can-outline' }]
  },
  components: { EditorLink }
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: flex-start;

  .comment-avatar {
    margin: 0.375rem 0.375rem 0 0;
  }

  .author {
    color: #000;
    font-size: 1rem;
  }

  .edited, .time {
    color: #888;
    font-size: 0.75rem;
  }

  hr.v-divider--vertical {
    margin: 0.25rem 0.125rem 0.125rem 0.625rem;
  }

  ::v-deep .editor-link {
    display: inline-flex;
    align-self: flex-end;
  }

  .actions {
    margin-left: auto;
  }
}
</style>
