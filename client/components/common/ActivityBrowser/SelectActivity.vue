<template>
  <div class="select-activity">
    <circular-progress v-if="showLoader" />
    <div v-else>
      <span @click="back" class="btn-back">
        <span class="mdi mdi-chevron-left"></span> Back
      </span>
      <div v-if="!currentLevel.length" class="well">
        {{ isCompatibleSchema
          ? 'There are no items within this repository.'
          : 'Not compatible with current repository schema.'
        }}
      </div>
      <div
        v-for="activity in currentLevel"
        :key="activity.id"
        :class="{ leaf: !hasChildren(activity), selectable: isSelectable(activity) }"
        class="activity-item">
        <span @click="show(activity)" class="name">
          {{ getName(activity) | truncate(100) }}
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
import activityApi from 'client/api/activity';
import CircularProgress from 'components/common/CircularProgress';
import filter from 'lodash/filter';
import find from 'lodash/find';
import first from 'lodash/first';
import get from 'lodash/get';
import { getAncestors } from 'client/utils/activity';
import { getSchemaId } from 'shared/activities';
import map from 'lodash/map';
import Promise from 'bluebird';
import reduce from 'lodash/reduce';
import uniqBy from 'lodash/uniqBy';

export default {
  props: {
    repository: { type: Object, required: true },
    selectableLevels: { type: Array, default: () => ([]) }
  },
  data() {
    return {
      showLoader: true,
      activities: [],
      parent: null
    };
  },
  computed: {
    currentLevel() {
      return this.getChildren(this.parent);
    },
    isCompatibleSchema() {
      if (!this.selectableLevels.length) return true;
      const schema = getSchemaId(first(this.selectableLevels).type);
      return schema === this.repository.schema;
    }
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
      if (!this.selectableLevels.length) return true;
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
  created() {
    const activitiesFetch = activityApi.getActivities(this.repository.id);
    return Promise.join(activitiesFetch, Promise.delay(700), activities => {
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
  padding: 8px 50px;
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

.btn-fab.btn-select {
  display: none;
  position: absolute;
  right: -20px;
  transform: translate(0, -40%);
}

.selectable:hover {
  .btn-select {
    display: inline-block;
  }
}

.circular-progress {
  margin: 20px 0;
}
</style>
