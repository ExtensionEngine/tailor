<template>
  <div>
    <v-chip
      v-for="tag in repository.tags"
      :key="tag.id"
      @click:close="showDeleteConfirmation(tag)"
      color="grey darken-1"
      text-color="white"
      close>
      {{ tagName(tag) }}
    </v-chip>
    <add-tag v-if="exceedTagLimit" :repository="repository" />
  </div>
</template>

<script>
import AddTag from './AddTag';
import EventBus from 'EventBus';
import { mapActions } from 'vuex';
import truncate from 'lodash/truncate';

const appChannel = EventBus.channel('app');
const TAG_LIMIT = 3;

export default {
  props: {
    repository: { type: Object, required: true }
  },
  computed: {
    exceedTagLimit: ({ repository }) => repository.tags.length < TAG_LIMIT
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
    tagName(tag) {
      if (this.repository.tags.length === 2 && tag.name.length > 8) {
        return truncate(tag.name, { length: 6 });
      }
      if (this.repository.tags.length === 3 && tag.name.length > 4) {
        return truncate(tag.name, { length: 5 });
      }
      return tag.name;
    }
  },
  components: { AddTag }
};
</script>

<style lang="scss" scoped>
.v-card__actions .v-chip {
  margin-right: 0.25rem;
  font-size: 0.75rem;
}
</style>
