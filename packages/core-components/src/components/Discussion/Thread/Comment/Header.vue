<template>
  <div class="header">
    <v-avatar size="34" class="comment-avatar">
      <img :src="author.imgUrl">
    </v-avatar>
    <div class="info-container">
      <div class="d-flex align-center">
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <span v-on="on" class="author text-truncate">{{ author.label }}</span>
          </template>
          {{ author.label }}
        </v-tooltip>
        <span v-if="showEditedLabel" class="edited ml-1">(edited)</span>
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
        <template v-if="isActivityThread && elementLabel">
          <v-divider vertical />
          <editor-link
            :activity-id="comment.activityId"
            :element-uid="elementUid"
            :label="elementLabel" />
        </template>
      </div>
    </div>
    <div v-if="showOptions" class="actions">
      <v-btn
        v-for="({ action, icon, color }, name) in options"
        :key="name"
        @click="$emit(action)"
        x-small icon
        class="ml-1">
        <v-icon :color="color" size="14"> mdi-{{ icon }}</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import EditorLink from '@/components/EditorLink.vue';

const getOptions = () => ({
  resolve: { action: 'resolve', icon: 'checkbox-outline', color: 'teal accent-4' },
  edit: { action: 'toggleEdit', icon: 'pencil-outline', color: 'grey' },
  remove: { action: 'remove', icon: 'trash-can-outline', color: 'grey' }
});

export default {
  name: 'comment-header',
  props: {
    comment: { type: Object, required: true },
    isActivityThread: { type: Boolean, default: false },
    isResolved: { type: Boolean, default: false },
    elementLabel: { type: String, default: null },
    user: { type: Object, required: true }
  },
  computed: {
    elementUid: vm => vm.comment.contentElement.uid,
    author: vm => vm.comment.author,
    isAuthor: vm => vm.author.id === vm.user.id,
    isDeleted: vm => !!vm.comment.deletedAt,
    showEditedLabel: vm => !!vm.comment.editedAt,
    showOptions: vm => vm.isAuthor && !vm.isDeleted && !vm.isResolved,
    options() {
      const options = getOptions();
      if (this.isActivityThread) delete options.resolve;
      return options;
    }
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

  .info-container {
    display: flex;
    flex-direction: column;
    flex: 0 100%;
    max-width: calc(100% - 8rem);
    margin-left: 0.125rem;

    .author {
      display: inline-block;
      max-width: 75%;
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
  }

  .actions {
    margin-left: auto;
  }
}
</style>
