<template>
  <div>
    <circular-progress v-if="showLoader"></circular-progress>
    <div v-else>
      <button @click="back" class="btn btn-default btn-fab">
        <span class="mdi mdi-chevron-left"></span>
      </button>
      <div
        v-for="activity in currentLevel"
        :key="activity.id"
        :class="{ 'leaf': !hasChildren(activity) }"
        class="activity-item">
        <span @click="show(activity)">{{ getName(activity) }}</span>
        <button
          v-show="isSelectable(activity)"
          @click="$emit('selected', activity)"
          class="btn btn-fab btn-default">
          <span class="mdi mdi-upload"></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { getAncestors } from 'client/utils/activity';
import activityApi from 'client/api/activity';
import CircularProgress from 'components/common/CircularProgress';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import uniqBy from 'lodash/uniqBy';

export default {
  props: ['repository', 'levels'],
  data() {
    return {
      showLoader: true,
      activities: [],
      parent: null
    };
  },
  methods: {
    show(activity) {
      this.parent = activity;
    },
    back() {
      if (get(this.parent, 'parentId')) {
        this.show(find(this.activities, { id: this.parent.parentId }));
      } else if (this.parent) {
        this.parent = null;
      } else {
        this.$emit('reset');
      }
    },
    isSelectable({ type }) {
      if (!this.levels) return true;
      return !!find(this.levels, { type });
    },
    hasChildren(activity) {
      return !!this.getChildren(activity).length;
    },
    getChildren(activity) {
      const parentId = get(activity, 'id', null);
      return filter(this.activities, { parentId });
    },
    getName(activity) {
      return get(activity, 'data.name', activity.type);
    }
  },
  computed: {
    currentLevel() {
      return this.getChildren(this.parent);
    }
  },
  created() {
    activityApi.getActivities(this.repository.id).then(activities => {
      // Make sure that only selectable activities and their parents
      // are included
      const types = map(this.levels, 'type');
      const targets = filter(activities, it => types.includes(it.type));
      activities = reduce(targets,
        (acc, it) => acc.concat([it, ...getAncestors(activities, it)]), []);
      this.activities = uniqBy(activities, 'id');
      this.showLoader = false;
    });
  },
  components: { CircularProgress }
};
</script>

<style lang="scss" scoped>
.activity-item {
  padding: 5px 20px;
}
</style>
