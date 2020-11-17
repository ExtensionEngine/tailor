<template>
  <div class="tags-container">
    <div class="tag-list">
      <v-chip
        v-for="{ id, name, truncatedName } in tags"
        :key="id"
        @click:close="showDeleteConfirmation(id, name)"
        color="blue-grey lighten-4"
        label light small close
        class="mr-2">
        <v-tooltip
          :disabled="name.length === truncatedName.length"
          open-delay="100"
          bottom>
          <template v-slot:activator="{ on }">
            <span v-on="on">{{ truncatedName }}</span>
          </template>
          <span>{{ name }}</span>
        </v-tooltip>
      </v-chip>
    </div>
    <v-tooltip v-if="!exceededTagLimit" open-delay="400" bottom>
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" @click="showTagDialog = true" color="blue-grey lighten-3" icon>
          <v-icon dense>mdi-tag-plus</v-icon>
        </v-btn>
      </template>
      Add tag
    </v-tooltip>
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
import map from 'lodash/map';
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
    tagCount: vm => get(vm.repository, 'tags.length', 0),
    exceededTagLimit: vm => vm.repository.tags.length >= TAG_LIMIT,
    maxTagNameLength: vm => [15, 6, 5][clamp(vm.tagCount - 1, 0, 2)],
    tags() {
      const { repository, maxTagNameLength: length } = this;
      return map(repository.tags, tag => {
        const truncatedName = truncate(tag.name, { length });
        return { ...tag, truncatedName };
      });
    }
  },
  methods: {
    ...mapActions('repositories', ['removeTag']),
    ...mapRequests('app', ['showConfirmationModal']),
    showDeleteConfirmation(tagId, tagName) {
      const data = { repositoryId: this.repository.id, tagId };
      this.showConfirmationModal({
        title: 'Delete tag',
        message: `Are you sure you want to delete tag ${tagName}?`,
        action: () => this.removeTag(data)
      });
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
