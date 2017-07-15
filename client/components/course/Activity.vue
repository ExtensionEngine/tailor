<template>
  <div>
    <div v-if="!isRoot" class="activity-wrapper">
      <div
        :class="{ 'selected': isSelected(activity.id) }"
        @click="select"
        class="activity">
        <span :style="{ 'background-color': color }" class="position">
          {{ index + 1 }}
        </span>
        <span class="activity-name">{{ name }}</span>
        <span class="actions pull-right">
          <span
            :class="collapsibleIcon"
            @click.stop="isCollapsed = !isCollapsed"
            class="collapsible">
          </span>
        </span>
      </div>
      <insert-activity
        :parent="activity"
        :level="level"
        @expand="isCollapsed = false">
      </insert-activity>
    </div>
    <div v-if="!isCollapsed && hasChildren">
      <draggable :list="children" :options="dragOptions" @update="reorder">
        <activity
          v-for="(it, index) in children"
          :key="it._cid"
          :id="it.id"
          :_cid="it._cid"
          :name="it.name"
          :position="it.position"
          :index="index"
          :level="level + 1"
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
import { getLevel, OUTLINE_LEVELS } from 'shared/activities';
import InsertActivity from './InsertActivity';
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
import NoActivities from './NoActivities';
import values from 'lodash/values';

export default {
  name: 'activity',
  props: ['_cid', 'id', 'name', 'position', 'level', 'activities', 'activity', 'index'],
  data() {
    return {
      isCollapsed: this.level !== 0,
      dragOptions: { handle: '.activity' }
    };
  },
  computed: {
    ...mapGetters({ focusedActivity: 'activity' }, 'course'),
    isRoot() {
      return this.level === 0;
    },
    color() {
      return OUTLINE_LEVELS[this.level - 1].color;
    },
    hasChildren() {
      return (this.children.length > 0) && (this.level < OUTLINE_LEVELS.length);
    },
    children() {
      const childLevel = getLevel(this.level + 1);
      const childType = childLevel ? childLevel.type : undefined;
      const filterByParent = this.isRoot
        ? act => !act.parentId && act.type === childType
        : act => this.id && this.id === act.parentId && act.type === childType;

      return values(this.activities)
        .filter(filterByParent)
        .sort((x, y) => x.position - y.position);
    },
    collapsibleIcon() {
      return {
        'mdi mdi-chevron-up': this.isCollapsed && this.hasChildren,
        'mdi mdi-chevron-down': !this.isCollapsed && this.hasChildren
      };
    }
  },
  methods: {
    ...mapMutations(['focusActivity'], 'course'),
    ...mapActions({ updatePosition: 'reorder' }, 'activities'),
    select() {
      this.focusActivity(this._cid);
    },
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
  font-size: 16px;
  text-align: left;
  cursor: pointer;
  background-color: white;
  border-radius: 3px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);

  &.selected {
    box-shadow: 0 2px 5px rgba(0,0,0,0.15), 0 2px 5px rgba(0,0,0,0.30);
  }

  .position {
    position: absolute;
    min-width: 40px;
    height: 40px;
    margin-right: 7px;
    padding: 6px 10px 0 10px;
    color: white;
    font-size: 20px;
    text-align: center;
    border-radius: 3px 0px 0px 3px;
  }

  .collapsible {
    color: #bbb;
    font-size: 26px;
  }

  .activity-name {
    display: block;
    height: 40px;
    position: relative;
    top: 0;
    left: 0;
    padding: 10px 60px 0 55px;
    color: #555;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .actions {
    position: absolute;
    right: 0;
    top: 0;
    padding-right: 5px;

    .mdi {
      display: inline-block;
      padding: 3px 5px;
    }

    .mdi:hover {
      color: #707070;
    }
  }
}

.divider-wrapper {
  width: 100%;
  padding: 7px 0;
  cursor: pointer;
  opacity: 0;

  &:hover {
    opacity: 1;
  }

  .divider {
    position: relative;
    width: 100%;
    height: 2px;
    background-color: #aaa;
    opacity: inherit;

    .action {
      position: absolute;
      top: -8px;
      right: -27px;
      height: 0; // avoids visual issues while dragging
      font-size: 16px;
      color: #aaa;
      text-align: left;
    }
  }
}

.sub-activity {
  margin-left: 40px;
}
</style>
