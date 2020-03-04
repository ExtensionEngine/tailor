<template>
  <v-list-item class="pl-0">
    <v-list-item-content>
      <v-list-item-title v-text="relationship.label" />
      <v-list-item-subtitle v-text="relationshipTags" />
    </v-list-item-content>
    <v-list-item-action>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            @click="show = true"
            :class="{ 'mr-3': selected.length }"
            outlined icon>
            <v-icon v-if="!selected.length">mdi-plus</v-icon>
            <v-icon v-else>mdi-pen</v-icon>
          </v-btn>
        </template>
        <span>{{ relationship.placeholder || defaultPlaceholder }}</span>
      </v-tooltip>
      <v-tooltip v-if="selected.length" bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            @click="clearAll"
            color="error" outlined icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
        <span>Clear All</span>
      </v-tooltip>
    </v-list-item-action>
    <tailor-dialog
      v-model="show"
      @click:outside="cancel"
      header-icon="mdi-transit-connection-variant"
      width="650">
      <template v-slot:header>
        {{ relationship.placeholder || defaultPlaceholder }}
      </template>
      <template v-slot:body>
        <v-expand-transition>
          <activity-tree
            v-if="!showTesList"
            @update:open="openTesList($event)"
            :selected="selected" />
          <div v-else>
            <tes-list
              @change="selected = $event"
              :allowed-types="relationship.allowedTypes"
              :multiple="relationship.multiple"
              :selected="selected"
              :content-containers="contentContainers"
              :element-id="element.id"
              :outline-id="outlineId"
              :repository-id="repositoryId" />
          </div>
        </v-expand-transition>
      </template>
      <template v-slot:actions>
        <v-btn v-if="showTesList" @click="showTesList = false" text outlined>
          <v-icon>mdi-arrow-left</v-icon> Back to Activities
        </v-btn>
        <v-btn @click="cancel" :disabled="isSaving" text class="ml-1">
          Cancel
        </v-btn>
        <v-btn @click="save" :disabled="isSaving" color="secondary" text>
          Save
        </v-btn>
      </template>
    </tailor-dialog>
  </v-list-item>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import ActivityTree from './ActivityTree';
import cloneDeep from 'lodash/cloneDeep';
import { getDescendants } from 'client/utils/activity';
import reduce from 'lodash/reduce';
import set from 'lodash/set';
import sortBy from 'lodash/sortBy';
import TailorDialog from '@/components/common/TailorDialog';
import TesList from './TesList';
import unset from 'lodash/unset';

const getRelationshipTagsByActivity = (activities, relationships) =>
  reduce(activities, (relationshipTags, { id, data: { name } }) => {
    const { length } = relationships.filter(({ outlineId }) => outlineId === id);
    return length ? [...relationshipTags, `${name} (${length})`] : relationshipTags;
  }, []);

export default {
  props: {
    relationship: { type: Object, required: true },
    element: { type: Object, required: true }
  },
  data: () => ({
    show: false,
    selected: [],
    cancelState: [],
    contentContainers: [],
    showTesList: false,
    isSaving: false,
    outlineId: null
  }),
  computed: {
    ...mapGetters('repository', ['activities', 'structure']),
    repositoryId: ({ activities }) => Object.values(activities)[0].repositoryId,
    relationshipTags: ({ activities, selected }) => {
      if (!selected.length) return null;
      return getRelationshipTagsByActivity(activities, selected).join(', ');
    },
    defaultPlaceholder: ({ relationship: { multiple } }) =>
      `Select ${multiple ? 'elements' : 'element'}`
  },
  methods: {
    ...mapActions('repository/tes', ['update']),
    async save() {
      const { selected, relationship: { type, multiple } } = this;
      const element = cloneDeep(this.element) || {};
      set(element, `refs.${type}`, multiple ? selected : selected[0]);
      await this.update(element);
      this.close();
    },
    async clearAll() {
      const element = cloneDeep(this.element) || {};
      unset(element, `refs.${this.relationship.type}`);
      await this.update(element);
      this.selected = [];
    },
    openTesList(activity) {
      if (!activity) return;
      this.contentContainers = sortBy(
        getDescendants(this.activities, activity),
        'position'
      );
      this.outlineId = activity.id;
      this.showTesList = true;
    },
    close() {
      this.showTesList = false;
      this.show = false;
    },
    cancel() {
      this.selected = [...this.cancelState];
      this.close();
    }
  },
  watch: {
    show() {
      this.cancelState = [...this.selected];
    }
  },
  created() {
    const { element, relationship } = this;
    const selected = element.refs[relationship.type];
    if (!selected) return;
    this.selected = Array.isArray(selected) ? selected : [selected];
  },
  components: { ActivityTree, TailorDialog, TesList }
};
</script>

<style lang="scss" scoped>
.v-list-item__action {
  display: flex;
  flex-direction: row;
}
</style>
