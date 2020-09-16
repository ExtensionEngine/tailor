<template>
  <tailor-dialog
    v-model="visible"
    header-icon="mdi-content-copy"
    width="650"
    persistent>
    <template v-if="showActivator" v-slot:activator="{ on }">
      <v-btn v-on="on" color="grey darken-3" text class="px-1">
        <v-icon class="pr-1">mdi-content-copy</v-icon>Copy
      </v-btn>
    </template>
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
          :supported-levels="levels"
          :activities="selectedRepository.activities || []" />
      </div>
    </template>
    <template v-slot:actions>
      <v-btn @click="close" :disabled="isCopyingActivities" text>Cancel</v-btn>
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
import insertActions from '@/utils/insertActions';
import pluralize from 'pluralize';
import Promise from 'bluebird';
import repositoryApi from 'client/api/repository';
import RepositoryTree from './RepositoryTree';
import { SCHEMAS } from 'shared/activities';
import sortBy from 'lodash/sortBy';
import TailorDialog from '@/components/common/TailorDialog';

const { ADD_INTO } = insertActions;

export default {
  name: 'copy-activity',
  props: {
    repositoryId: { type: Number, required: true },
    levels: { type: Array, required: true },
    action: { type: String, required: true },
    anchor: { type: Object, default: null },
    showActivator: { type: Boolean, default: false }
  },
  data: () => ({
    visible: false,
    repositories: [],
    selectedRepository: null,
    selectedActivities: [],
    isFetchingRepositories: true,
    isFetchingActivities: false,
    isCopyingActivities: false
  }),
  computed: {
    ...mapGetters('repository', ['repository']),
    schema: vm => SCHEMAS.find(it => it.id === vm.repository.schema),
    copyBtnLabel: ({ selectedActivities, action }) => {
      const selectionLabel = selectedActivities.length
        ? `${selectedActivities.length} items`
        : '';
      return `Copy ${selectionLabel} ${action === ADD_INTO ? 'inside' : ''}`;
    }
  },
  methods: {
    ...mapActions('repository/activities', ['clone']),
    ...mapGetters('repository/activities', ['calculateInsertPosition']),
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
      const { anchor, action } = this;
      const payload = {
        srcId,
        srcRepositoryId,
        repositoryId: this.repositoryId,
        type,
        position: this.calculateInsertPosition(activity, anchor, action)
      };
      if (anchor) {
        payload.parentId = action === ADD_INTO ? anchor.id : anchor.parentId;
      }
      return this.clone(payload);
    },
    async copySelection() {
      this.isCopyingActivities = true;
      const items = sortBy(this.selectedActivities, ['parentId', 'position']);
      await Promise.each(items, it => this.copyActivity(it));
      this.$emit('completed', items[0].parentId);
      this.isCopyingActivities = false;
      this.close();
    },
    close() {
      this.visible = false;
      this.$emit('close');
    }
  },
  async created() {
    const { schema } = this.repository;
    this.repositories = sortBy(await repositoryApi.getRepositories({ schema }), 'name');
    this.isFetchingRepositories = false;
  },
  mounted() {
    this.visible = !this.showActivator;
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
