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
        @click="filterOwn"
        :elevation="0"
        class="filters__btn text-capitalize mx-3">
        Only my issues
      </v-btn>
      <v-btn
        @click="filterRecentlyUpdated"
        :elevation="0"
        class="filters__btn text-capitalize mx-3">
        Recently updated
      </v-btn>
    </div>
    <div class="layout ma-4">
      <div v-for="status in statuses" :key="status.id" class="column grey lighten-3 d-flex flex-column px-3">
        <h5 class="text-uppercase align-self-start">
          {{ status.label }}
        </h5>
        <card
          v-for="activity in getActivitiesByStatus(status.id)"
          :key="activity.id"
          v-bind="activity" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import Card from './Card';
import get from 'lodash/get';
import { getSchema } from 'shared/activities';
import groupBy from 'lodash/groupBy';
import sample from 'lodash/sample';

export default {
  name: 'workflow-board',
  computed: {
    ...mapState({
      user: state => state.auth.user
    }),
    ...mapGetters('repository', ['repository', 'structure', 'activities']),
    schema() {
      const { schema: schemaId } = this.repository || {};
      return schemaId ? getSchema(schemaId) : null;
    },
    statuses() {
      return get(this.schema, 'workflow.statuses', []);
    },
    groupedActivities() {
      if (!this.schema) return [];
      const { workflow } = this.schema;
      const mock = this.activities
        .map(it => {
          const { name } = it.data;
          const type = this.structure.find(({ type }) => type === it.type);
          const label = get(type, 'label');
          return {
            ...it,
            name,
            label,
            workflowStatus: sample(this.statuses)
          };
        })
        .filter(({ type }) => workflow.trackedActivities.includes(type));
      return groupBy(mock, 'workflowStatus.id');
    }
  },
  methods: {
    getActivitiesByStatus(statusId) {
      return get(this.groupedActivities, statusId, []);
    },
    filterOwn() {
      // TODO
    },
    filterRecentlyUpdated() {
      // TODO
    }
  },
  components: { Card }
};
</script>

<style lang="scss" scoped>
  .board {
    height: 100%;
  }

  .layout {
    display: grid;
    grid: 1fr / auto-flow 250px;
    gap: 1rem;
    overflow-x: scroll;
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
