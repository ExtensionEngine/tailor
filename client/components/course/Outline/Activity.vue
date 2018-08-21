<template>
  <div>
    <div v-if="!isRoot" class="activity-wrapper">
      <div
        :class="{ 'selected': isSelected(activity.id) }"
        @click="focusActivity(_cid)"
        class="activity">
        <span :style="{ 'background-color': color }" class="position">
          {{ index + 1 }}
        </span>
        <span class="activity-name">{{ name }}</span>
        <div class="actions">
          <button
            @click.stop="toggleActivity(activity)"
            class="collapsible">
            <span :class="collapsibleIcon"></span>
          </button>
        </div>
      </div>
      <insert-activity
        :parent="activity"
        :level="level"
        @expand="toggleActivity({ _cid: activity._cid, expanded: true })">
      </insert-activity>
    </div>
    <div v-if="!isCollapsed(activity) && hasChildren">
      <draggable :list="children" :options="dragOptions" @update="reorder">
        <activity
          v-for="(it, index) in children"
          :key="it._cid"
          :id="it.id"
          :_cid="it._cid"
          :index="index"
          :level="isRoot ? 1 : level + 1"
          :class="{ 'sub-activity': name }"
          :activities="activities"
          :activity="it">
        </activity>
      </draggable>
    </div>
    <no-activities v-if="isRoot && !hasChildren"></no-activities>
  </div>
</template>

<script>
import Draggable from 'vuedraggable';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import InsertActivity from './InsertActivity';
import map from 'lodash/map';
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
import NoActivities from './NoActivities';
import values from 'lodash/values';

export default {
  name: 'activity',
  props: {
    activity: { type: Object, default: null },
    index: { type: Number, default: null },
    _cid: { type: String, default: null },
    id: { type: Number, default: null },
    level: { type: Number, required: true },
    activities: { type: Array, default: () => ([]) }
  },
  data() {
    return {
      dragOptions: { handle: '.activity' }
    };
  },
  computed: {
    ...mapGetters({
      structure: 'structure',
      focusedActivity: 'activity',
      isCollapsed: 'isCollapsed'
    }, 'course'),
    isRoot() {
      return this.level === 0;
    },
    name() {
      return get(this.activity, 'data.name', '');
    },
    color() {
      return find(this.structure, { type: this.activity.type }).color;
    },
    hasChildren() {
      return (this.children.length > 0) && (this.level < this.structure.length);
    },
    children() {
      const level = this.level + 1;
      const types = map(filter(this.structure, { level }), 'type');
      const filterByParent = this.isRoot
        ? act => !act.parentId && types.includes(act.type)
        : act => this.id && this.id === act.parentId && types.includes(act.type);

      return values(this.activities)
        .filter(filterByParent)
        .sort((x, y) => x.position - y.position);
    },
    collapsibleIcon() {
      return {
        'mdi mdi-chevron-down': this.isCollapsed(this.activity) && this.hasChildren,
        'mdi mdi-chevron-up': !this.isCollapsed(this.activity) && this.hasChildren
      };
    }
  },
  methods: {
    ...mapMutations(['focusActivity', 'toggleActivity'], 'course'),
    ...mapActions({ updatePosition: 'reorder' }, 'activities'),
    isSelected(id) {
      return this.focusedActivity.id === id;
    },
    reorder({ newIndex: newPosition }) {
      const items = this.children;
      const activity = items[newPosition];
      const isFirstChild = newPosition === 0;
      const context = { items, newPosition, isFirstChild };
      this.updatePosition({ activity, context });
    }
  },
  components: {
    Draggable,
    InsertActivity,
    NoActivities
  }
};
</script>

<style lang="scss">
.activity {
  position: relative;
  color: #444;
  font-size: 17px;
  text-align: left;
  background-color: white;
  border-radius: 2px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;

  &.selected {
    box-shadow: 0 2px 5px rgba(0,0,0,0.15), 0 2px 5px rgba(0,0,0,0.3);
  }

  .position {
    position: absolute;
    min-width: 44px;
    height: 42px;
    margin-right: 7px;
    padding: 8px 10px 0;
    color: white;
    font-size: 20px;
    text-align: center;
    border-radius: 2px 0 0 2px;
  }

  .collapsible {
    padding: 8px 5px 6px;
    color: #bbb;
    font-size: 26px;
    line-height: 26px;
    background: none;
    border: none;
    outline: none;
  }

  .activity-name {
    display: block;
    position: relative;
    top: 0;
    left: 0;
    height: 42px;
    padding: 10px 60px 0;
    color: #555;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .actions {
    position: absolute;
    top: 0;
    right: 0;
    padding-right: 5px;

    .mdi:hover {
      color: #707070;
    }
  }
}

.sub-activity {
  margin-left: 40px;
}
</style>
