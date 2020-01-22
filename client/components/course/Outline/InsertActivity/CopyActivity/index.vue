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
      <v-progress-circular
        v-if="isFetchingRepositories"
        color="primary"
        indeterminate
        class="mt-4" />
      <div v-else-if="isCopyingActivities" class="ma-4">
        <div class="subtitle-1 text-center mb-2">
          Copying {{ selectedActivities.length }} items...
        </div>
        <v-progress-linear color="primary" indeterminate />
      </div>
      <div v-else>
        <v-autocomplete
          @input="selectRepository"
          :value="selectedRepository"
          :items="repositories"
          :label="schema.name"
          placeholder="Select..."
          item-text="name"
          prepend-inner-icon="mdi-magnify"
          outlined return-object
          class="mx-3 pt-3" />
        <repository-tree
          v-if="selectedRepository && !isFetchingActivities"
          @change="selectedActivities = $event"
          :schema-name="schema.name"
          :supported-levels="supportedLevels"
          :activities="selectedRepository.activities || []" />
      </div>
    </template>
    <template v-slot:actions>
      <v-btn @click="$emit('cancel')" :disabled="isCopyingActivities" text>
        Cancel
      </v-btn>
      <v-btn
        @click="copySelection"
        :disabled="!selectedActivities.length || isCopyingActivities"
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
    repositoryId: { type: Number, required: true },
    anchor: { type: Object, required: true },
    supportedLevels: { type: Array, required: true }
  },
  data: () => ({
    repositories: [],
    selectedRepository: null,
    selectedActivities: [],
    isFetchingRepositories: true,
    isFetchingActivities: false,
    isCopyingActivities: false
  }),
  computed: {
    ...mapGetters('course', ['course']),
    schema: vm => SCHEMAS.find(it => it.id === vm.course.schema),
    copyBtnLabel() {
      const { selectedActivities, anchor } = this;
      const supportedTypes = keyBy(this.supportedLevels, 'type');
      let label = 'Copy';
      if (!selectedActivities.length) return label;
      if (selectedActivities.length > 1) label += ` ${selectedActivities.length} items`;
      const itemLevel = supportedTypes[selectedActivities[0].type].level;
      const anchorLevel = supportedTypes[anchor.type].level;
      return itemLevel > anchorLevel ? label.concat(' inside') : label;
    }
  },
  methods: {
    ...mapActions('activities', ['clone']),
    ...mapGetters('activities', ['calculateInsertPosition']),
    async selectRepository(repository) {
      this.selectedRepository = repository;
      this.selectedActivities = [];
      if (repository.activities) return;
      this.isFetchingActivities = true;
      const activities = await activityApi.getActivities(repository.id);
      repository.activities = sortBy(activities, 'position');
      this.isFetchingActivities = false;
    },
    async copyActivity(activity) {
      const { id: srcId, repositoryId: srcRepositoryId, type } = activity;
      const payload = {
        srcId,
        srcRepositoryId,
        repositoryId: this.repositoryId,
        type,
        position: this.calculateInsertPosition(activity, this.anchor)
      };
      if (this.anchor) {
        payload.parentId = isSameLevel(activity, this.anchor)
          ? this.anchor.parentId
          : this.anchor.id;
      }
      return this.clone(payload);
    },
    async copySelection() {
      this.isCopyingActivities = true;
      const items = sortBy(this.selectedActivities, ['parentId', 'position']);
      await Promise.each(items, it => this.copyActivity(it));
      this.isCopyingActivities = false;
      this.$emit('completed', this.anchor);
    }
  },
  async created() {
    const { schema } = this.course;
    this.repositories = sortBy(await courseApi.getRepositories({ schema }), 'name');
    this.isFetchingRepositories = false;
  },
  filters: {
    pluralize: val => pluralize(val)
  },
  components: { RepositoryTree, TailorDialog }
};
</script>

<style lang="scss" scoped>
::v-deep .v-list-item__content {
  flex: initial;
}
</style>
