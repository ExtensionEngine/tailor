<template>
  <tailor-dialog
    :value="true"
    header-icon="mdi-content-copy"
    width="650"
    persistent>
    <template v-slot:header>
      Copy items from {{ schema.name | pluralize }}
    </template>
    <template v-slot:body>
      <div v-if="fetchingRepositories" class="search-spinner">
        <v-progress-circular color="primary" indeterminate />
      </div>
      <div v-else-if="selectedRepository">
        <v-container class="mx-0 py-3">
          <v-autocomplete
            @input="selectRepository"
            :value="selectedRepository"
            :items="repositories"
            :label="schema.name"
            prepend-inner-icon="mdi-magnify"
            item-text="name"
            outlined return-object />
          <v-text-field
            v-model="search"
            :placeholder="`Filter selected ${schema.name}...`"
            prepend-inner-icon="mdi-filter-outline"
            clear-icon="mdi-close-circle-outline"
            clearable outlined />
        </v-container>
        <repository-tree
          @change="selected = $event"
          :schema-name="schema.name"
          :selectable-types="supportedLevels"
          :activities="selectedRepository.activities || []"
          :search="search" />
      </div>
    </template>
    <template v-slot:actions>
      <v-btn @click="$emit('cancel')" text>Cancel</v-btn>
      <v-btn
        @click="copySelection"
        :disabled="!selected.length"
        color="secondary"
        text
        class="mr-1">
        {{ copyBtnLabel }}
      </v-btn>
    </template>
  </tailor-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import activityApi from 'client/api/activity';
import courseApi from 'client/api/course';
import filter from 'lodash/filter';
import get from 'lodash/get';
import { isSameLevel } from 'utils/activity';
import keyBy from 'lodash/keyBy';
import pluralize from 'pluralize';
import Promise from 'bluebird';
import RepositoryTree from './RepositoryTree';
import { SCHEMAS } from 'shared/activities';
import sortBy from 'lodash/sortBy';
import TailorDialog from '@/components/common/TailorDialog';

export default {
  props: {
    anchor: { type: Object, required: true },
    supportedLevels: { type: Array, required: true }
  },
  data: () => ({
    fetchingRepositories: true,
    repositories: [],
    selectedRepository: null,
    selected: [],
    search: ''
  }),
  computed: {
    ...mapGetters('course', ['course']),
    schema: vm => SCHEMAS.find(it => it.id === vm.course.schema),
    copyBtnLabel() {
      const { selected, anchor } = this;
      const supportedTypes = keyBy(this.supportedLevels, 'type');
      let label = 'Copy';
      if (!selected.length) return label;
      if (selected.length > 1) label += ` ${selected.length} items`;
      const itemLevel = supportedTypes[selected[0].type].level;
      const anchorLevel = supportedTypes[anchor.type].level;
      return itemLevel > anchorLevel ? label.concat(' inside') : label;
    }
  },
  methods: {
    ...mapActions('activities', ['clone']),
    ...mapGetters('activities', ['calculateInsertPosition']),
    async selectRepository(repository) {
      this.selectedRepository = repository;
      if (repository.activities.length) return;
      const activities = await activityApi.getActivities(repository.id);
      repository.activities = sortBy(activities, 'position');
    },
    async copyActivity(activity) {
      const { id: srcId, repositoryId: srcRepositoryId, type } = activity;
      const payload = {
        srcId,
        srcRepositoryId,
        repositoryId: this.anchor.repositoryId,
        position: this.calculateInsertPosition(activity, this.anchor),
        type
      };
      if (this.anchor) {
        payload.parentId = isSameLevel(activity, this.anchor)
          ? this.anchor.parentId
          : this.anchor.id;
      }
      return this.clone(payload);
    },
    async copySelection() {
      const items = sortBy(this.selected, ['parentId', 'position']);
      await Promise.each(items, it => this.copyActivity(it));
      this.$emit('completed', this.anchor);
    }
  },
  async created() {
    const { schema } = this.course;
    const items = sortBy(await courseApi.getRepositories(), 'name');
    this.repositories = filter(items, { schema }).map(it => ({ ...it, activities: [] }));
    this.selectRepository(this.repositories[0]);
    this.fetchingRepositories = false;
  },
  filters: {
    pluralize(val) {
      return pluralize(val);
    }
  },
  components: { RepositoryTree, TailorDialog }
};
</script>

<style lang="scss" scoped>
::v-deep .v-list-item__content {
  flex: initial;
}
</style>
