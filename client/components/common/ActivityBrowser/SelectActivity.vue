<template>
  <div class="select-activity">
    <circular-progress v-if="showLoader"></circular-progress>
    <div v-else>
      <span @click="back" class="btn-back">
        <span class="mdi mdi-chevron-left"></span> Back
      </span>
      <div
        v-for="activity in currentLevel"
        :key="activity.id"
        :class="{ leaf: !hasChildren(activity), selectable: isSelectable(activity) }"
        class="activity-item">
        <span @click="show(activity)" class="name">
          {{ getName(activity) }}
          <span class="mdi mdi-chevron-right subitems-indicator"></span>
        </span>
        <button
          @click="$emit('selected', activity)"
          class="btn btn-default btn-fab btn-select">
          <span class="mdi mdi-content-duplicate"></span>
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
  props: ['repository', 'selectableLevels'],
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
      if (!this.selectableLevels) return true;
      return !!find(this.selectableLevels, { type });
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
      const types = map(this.selectableLevels, 'type');
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
$highlight: #42b983;

.select-activity {
  padding: 20px 0;
}

.btn-back {
  display: inline-block;
  margin: 0 0 10px;
}

.activity-item, .btn-back {
  position: relative;
  padding: 8px 40px;
  font-size: 14px;

  &:hover {
    color: $highlight;
    cursor: pointer;
  }
}

.leaf {
  .name {
    pointer-events: none;
  }

  .subitems-indicator {
    display: none;
  }
}

.btn-select {
  display: none;
  position: absolute;
  right: -20px;
  transform: translate(0, -50%);
}

.selectable:hover {
  .btn-select {
    display: inline-block;
  }
}
</style>
