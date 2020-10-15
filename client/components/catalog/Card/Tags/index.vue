<template>
  <div class="tags-container">
    <div class="tag-list">
      <v-chip
        v-for="tag in repository.tags"
        :key="tag.id"
        @click:close="showDeleteConfirmation(tag)"
        color="blue-grey lighten-4"
        label light small close
        class="mr-2">
        {{ truncateTagName(tag.name) }}
      </v-chip>
    </div>
    <v-btn v-if="!exceededTagLimit" @click="showTagDialog = true" icon>
      <v-icon color="blue-grey lighten-3" dense>mdi-tag-plus</v-icon>
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
import get from 'lodash/get';
import { mapActions } from 'vuex';
import { mapRequests } from '@/plugins/radio';
import truncate from 'lodash/truncate';

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
    ...mapRequests('app', ['showConfirmationModal']),
    showDeleteConfirmation(tag) {
      const data = { repositoryId: this.repository.id, tagId: tag.id };
      this.showConfirmationModal({
        title: 'Delete tag',
        message: `Are you sure you want to delete tag ${tag.name}?`,
        action: () => this.removeTag(data)
      });
    },
    truncateTagName(tag) {
      const tagCount = get(this.repository, 'tags.length', TAG_LIMIT) - 1;
      const length = [15, 6, 5][clamp(tagCount, 0, 2)];
      return truncate(tag, { length });
    }
  },
  components: { AddTag }
};
</script>

<style lang="scss" scoped>
.tags-container {
  display: flex;
  height: 2.125rem;
  justify-content: space-between;
  flex-basis: 100%;
}

.tag-list {
  padding: 0.25rem 0 0 0.25rem;
}
</style>
