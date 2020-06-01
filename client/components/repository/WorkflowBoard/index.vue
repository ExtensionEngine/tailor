<template>
  <div class="board d-flex flex-column grey lighten-4">
    <div class="filters d-flex align-center px-4">
      <v-text-field
        class="search-field"
        prepend-inner-icon="mdi-magnify"
        placeholder="Search" />
      <div class="ml-5 mr-3">
        <v-avatar :size="34" color="avatar grey lighten2 white--text">
          <img :src="user.imgUrl">
        </v-avatar>
      </div>
      <v-btn
        @click="filterRecentlyUpdated"
        :elevation="0"
        class="mx-3 filters__btn text-capitalize">
        Recently updated
      </v-btn>
    </div>
    <div class="layout mt-4 mx-4 flex-grow-0">
      <h5 v-for="state in states" :key="state.id" class="state-title pa-3 grey lighten-3 text-uppercase align-self-start">
        {{ state.label }}
      </h5>
    </div>
    <div class="columns mx-4 flex-grow-0">
      <div v-for="state in states" :key="state.id" class="cards d-flex flex-column align-center grey lighten-3">
        <card
          v-for="activity in getActivitiesByState(state.id)"
          :key="activity.id"
          :activity="activity"
          :assignee="user" />
      </div>
    </div>
    <sidebar empty-message="Please select Item on the left to view and edit it's details here." />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import Card from './Card';
import find from 'lodash/find';
import get from 'lodash/get';
import { getSchema } from 'shared/activities';
import groupBy from 'lodash/groupBy';
import pick from 'lodash/pick';
import selectActivity from '../common/selectActivity';
import Sidebar from '../common/Sidebar';

export default {
  name: 'workflow-board',
  mixins: [selectActivity],
  computed: {
    ...mapState({
      user: state => state.auth.user
    }),
    ...mapGetters('repository', [
      'repository',
      'structure',
      'workflowActivities',
      'activities'
    ]),
    schema() {
      const { schema: schemaId } = this.repository || {};
      return schemaId ? getSchema(schemaId) : null;
    },
    states() {
      return get(this.schema, 'workflow.states', []);
    },
    groupedActivities() {
      const mock = this.activities
        .map(it => {
          const { name } = it.data;
          const type = this.structure.find(({ type }) => type === it.type);
          const workflowState = find(this.states, { id: it.data.stateId });
          return {
            ...it,
            ...pick(type, ['label', 'color']),
            name,
            workflowState
          };
        })
        .filter(({ type }) => this.workflowActivities.find(it => it.type === type));
      return groupBy(mock, 'workflowState.id');
    }
  },
  methods: {
    getActivitiesByState(stateId) {
      return get(this.groupedActivities, stateId, []);
    },
    filterRecentlyUpdated() {
      // TODO
    }
  },
  components: { Card, Sidebar }
};
</script>

<style lang="scss" scoped>
%board-layout {
  display: grid;
  max-width: calc(100% - 435px);
  grid: auto / auto-flow 228px;
  gap: 0 1rem;
}

.board {
  position: relative;
  height: 100%;
  overflow: hidden;
}

.layout {
  @extend %board-layout;

  overflow-x: scroll;
}

.columns {
  @extend %board-layout;

  overflow-y: scroll;
}

.state-title {
  margin: 0;
}

.search-field {
  max-width: 400px;
}

.avatar.v-avatar {
  border: 2px solid;
  border-color: var(--v-white) !important;
}

.filters__btn {
  letter-spacing: inherit;
}
</style>
