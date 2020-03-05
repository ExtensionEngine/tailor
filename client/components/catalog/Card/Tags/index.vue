<template>
  <div class="tags-container">
    <div>
      <v-chip
        v-for="tag in repository.tags"
        :key="tag.id"
        @click:close="showDeleteConfirmation(tag)"
        color="grey darken-1"
        text-color="white"
        close>
        {{ truncateTagName(tag.name) }}
      </v-chip>
    </div>
    <v-btn v-if="!exceededTagLimit" @click="showTagDialog = true" icon small>
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <add-tag
      v-if="showTagDialog"
      @close="showTagDialog = false"
      :repository="repository" />
  </div>
</template>

<script>
import AddTag from './AddTag';
import clamp from 'lodash/clamp';
import EventBus from 'EventBus';
import { mapActions } from 'vuex';
import truncate from 'lodash/truncate';

const appChannel = EventBus.channel('app');
const TAG_LIMIT = 3;

export default {
  name: 'repository-tags',
  props: {
    repository: { type: Object, required: true }
  },
  data: () => ({ showTagDialog: false }),
  computed: {
    exceededTagLimit: ({ repository }) => repository.tags.length >= TAG_LIMIT
  },
  methods: {
    ...mapActions('repositories', ['removeTag']),
    showDeleteConfirmation(tag) {
      const data = { repositoryId: this.repository.id, tagId: tag.id };
      appChannel.emit('showConfirmationModal', {
        title: 'Delete tag',
        message: `Are you sure you want to delete tag ${tag.name}?`,
        action: () => this.removeTag(data)
      });
    },
    truncateTagName(tag) {
      const length = [15, 6, 5][clamp(this.repository.tags.length, 0, 2)];
      return truncate(tag, { length });
    }
  },
  components: { AddTag }
};
</script>

<style lang="scss" scoped>
.tags-container {
  display: flex;
  justify-content: space-between;
  flex-basis: 100%;

  .v-chip {
    height: 1.75rem !important;
    margin-right: 0.25rem;
    font-size: 0.75rem;
  }
}
</style>
