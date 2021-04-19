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
      <div v-if="isCopyingActivities" class="ma-4">
        <div class="subtitle-1 text-center mb-2">
          Copying {{ selectedActivities.length }} items...
        </div>
        <v-progress-linear color="primary darken-2" indeterminate />
      </div>
      <v-combobox
        @input="selectRepository"
        @update:search-input="fetchRepositories"
        :loading="isFetchingRepositories"
        :value="selectedRepository"
        :items="repositories"
        :label="schema.name"
        placeholder="Type to search repositories..."
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
import debounce from 'lodash/debounce';
import find from 'lodash/find';
import head from 'lodash/head';
import InsertLocation from '@/utils/InsertLocation';
import last from 'lodash/last';
import loader from '@/components/common/loader';
import pluralize from 'pluralize';
import Promise from 'bluebird';
import RepositoryTree from './RepositoryTree';
import { SCHEMAS } from '@tailor/config';
import sortBy from 'lodash/sortBy';
import TailorDialog from '@/components/common/TailorDialog';

const { ADD_INTO, ADD_AFTER } = InsertLocation;

export default {
  name: 'copy-activity',
  props: {
    repositoryId: { type: Number, required: true },
    levels: { type: Array, required: true },
    action: { type: String, required: true },
    anchor: { type: Object, default: null },
    showActivator: { type: Boolean, default: false }
  },
  inject: ['$api'],
  data: () => ({
    visible: false,
    repositories: [],
    selectedRepository: null,
    selectedActivities: [],
    copiedActivities: [],
    isFetchingRepositories: false,
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
    ...mapActions('repository/activities', ['clone', 'calculateCopyPosition']),
    async selectRepository(repository) {
      if (!find(this.repositories, { id: repository.id })) return;
      this.selectedRepository = repository;
      this.selectedActivities = [];
      if (repository.activities) return;
      this.isFetchingActivities = true;
      const activities = await this.$api.activity.getActivities(repository.id);
      repository.activities = sortBy(activities, 'position');
      this.isFetchingActivities = false;
    },
    async copyActivity(activity) {
      const { id: srcId, repositoryId: srcRepositoryId, type } = activity;
      const { action } = this;
      const anchor = (action === ADD_AFTER && last(this.copiedActivities)) || this.anchor;
      const payload = {
        srcId,
        srcRepositoryId,
        repositoryId: this.repositoryId,
        type,
        position: await this.calculateCopyPosition({ action, activity, anchor })
      };
      if (anchor) {
        payload.parentId = action === ADD_INTO ? anchor.id : anchor.parentId;
      }
      const activities = await this.clone(payload);
      this.copiedActivities.push(head(activities));
      return activities;
    },
    async copySelection() {
      this.isCopyingActivities = true;
      const items = sortBy(this.selectedActivities, ['parentId', 'position']);
      await Promise.each(items, it => this.copyActivity(it));
      this.$emit('completed', items[0].parentId);
      this.isCopyingActivities = false;
      this.copiedActivities = [];
      this.close();
    },
    close() {
      this.visible = false;
      this.$emit('close');
    },
    fetchRepositories: debounce(loader(function (search = '') {
      const params = { search, schema: this.repository.schema };
      return this.$api.repository.getRepositories(params).then(repositories => {
        this.repositories = sortBy(repositories, 'name');
      });
    }, 'isFetchingRepositories'), 500)
  },
  created() {
    this.fetchRepositories();
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
