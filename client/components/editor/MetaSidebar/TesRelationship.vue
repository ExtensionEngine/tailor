<template>
  <v-list-item class="pl-0">
    <v-list-item-content>
      <v-list-item-title>{{ relationship.label }}</v-list-item-title>
      <v-list-item-subtitle v-if="subtitle">{{ subtitle }}</v-list-item-subtitle>
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
        <span>{{ relationship.placeholder }}</span>
      </v-tooltip>
      <v-tooltip v-if="selected.length" bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            @click="remove"
            color="error" outlined icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
        <span>Clear All</span>
      </v-tooltip>
    </v-list-item-action>
    <tailor-dialog
      v-model="show"
      header-icon="mdi-content-copy"
      width="650">
      <template v-slot:header>
        {{ relationship.placeholder }}
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
              :activity-ids="activityIds"
              :element-id="element.id"
              :outline-id="outlineId"
              :repository-id="repositoryId" />
          </div>
        </v-expand-transition>
      </template>
      <template v-slot:actions>
        <v-btn v-if="showTesList" @click="back" text outlined>
          <v-icon>mdi-arrow-left</v-icon> Back to Activities
        </v-btn>
        <v-btn @click="close(true)" :disabled="isSaving" text class="ml-1">
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
import groupBy from 'lodash/groupBy';
import reduce from 'lodash/reduce';
import set from 'lodash/set';
import TailorDialog from '@/components/common/TailorDialog';
import TesList from './TesList';
import unset from 'lodash/unset';

export default {
  props: {
    relationship: { type: Object, required: true },
    element: { type: Object, required: true }
  },
  data: () => ({
    show: false,
    selected: [],
    cancelState: [],
    activityIds: [],
    showTesList: false,
    isSaving: false,
    outlineId: null
  }),
  computed: {
    ...mapGetters('repository', ['activities', 'structure']),
    repositoryId: ({ activities }) => Object.values(activities)[0].repositoryId,
    subtitle() {
      const { activities, selected } = this;
      if (!selected.length) return null;
      const groupedSelection = groupBy(selected, 'outlineId');
      return reduce(activities, (acc, { id, data }) => {
        if (!groupedSelection[id]) return acc;
        acc.push(`${data.name} - ${groupedSelection[id].length}`);
        return acc;
      }, []).join(', ');
    }
  },
  methods: {
    ...mapActions('tes', ['update']),
    async save() {
      const { selected, relationship: { type, multiple } } = this;
      const element = cloneDeep(this.element) || {};
      set(element, `refs.${type}`, multiple ? selected : selected[0]);
      await this.update(element);
      this.close();
    },
    async remove() {
      const element = cloneDeep(this.element) || {};
      unset(element, `refs.${this.relationship.type}`);
      await this.update(element);
      this.selected = [];
    },
    openTesList({ id: activityId }) {
      if (!activityId) {
        this.showTesList = false;
        this.activityIds = [];
        return;
      }
      this.activityIds = reduce(this.activities, (acc, activity) => {
        if (activity.parentId !== activityId) return acc;
        acc.push(activity.id);
        return acc;
      }, [activityId]);
      this.outlineId = activityId;
      this.showTesList = true;
    },
    close(isCancel = false) {
      if (isCancel) {
        this.selected = [...this.cancelState];
        this.cancelState = [];
      }
      this.showTesList = false;
      this.activityIds = [];
      this.show = false;
    },
    back() {
      this.showTesList = false;
      this.activityIds = [];
    }
  },
  created() {
    const { element, relationship } = this;
    if (!element.refs[relationship.type]) return;
    this.selected = Array.isArray(element.refs[relationship.type])
      ? element.refs[relationship.type]
      : [element.refs[relationship.type]];
    this.cancelState = [...this.selected];
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
