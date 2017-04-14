<template>
  <div>
    <div class="activity-wrapper" v-if="!isRoot">
      <div class="activity" @click="select">
        <span class="position" :style="{ 'background-color': color }">
          {{ index + 1 }}
        </span>
        <span class="collapsible" :class="collapsibleIcon"></span>
        <span class="activity-name">{{ name }}</span>
        <span class="actions pull-right" v-if="isEditable">
          <span @mousedown.stop="edit" class="mdi mdi-pencil"></span>
        </span>
      </div>
      <insert-activity
        :parent="activity"
        :level="level"
        @expand="isCollapsed = false">
      </insert-activity>
    </div>
    <div v-if="!isCollapsed && hasChildren">
      <draggable @update="reorder" :options="dragOptions" :list="children">
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
import { getLevel, isEditable, OUTLINE_LEVELS } from 'shared/activities';
import InsertActivity from './InsertActivity';
import { mapActions, mapMutations } from 'vuex-module';
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
    isRoot() {
      return this.level === 0;
    },
    color() {
      return OUTLINE_LEVELS[this.level - 1].color;
    },
    isEditable() {
      return isEditable(this.level);
    },
    hasChildren() {
      return (this.children.length > 0) && (this.level < OUTLINE_LEVELS.length);
    },
    children() {
      const childLevel = getLevel(this.level + 1);
      const childType = childLevel ? childLevel.type : undefined;
      const filterByParent = this.isRoot
        ? act => !act.parentId
        : act => this.id && this.id === act.parentId && act.type === childType;

      return values(this.activities)
        .filter(filterByParent)
        .sort((x, y) => x.position - y.position);
    },
    collapsibleIcon() {
      return {
        'fa fa-caret-right': this.isCollapsed && this.hasChildren,
        'fa fa-caret-down': !this.isCollapsed && this.hasChildren
      };
    }
  },
  methods: {
    ...mapMutations(['focusActivity'], 'course'),
    ...mapActions({ updatePosition: 'reorder' }, 'activities'),
    select() {
      this.isCollapsed = !this.isCollapsed;
      this.focusActivity(this._cid);
    },
    edit() {
      if (!this.isEditable) return;
      this.$router.push({
        name: 'editor',
        params: { activityId: this.activity.id }
      });
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
// TODO: Do proper styling
.activity {
  position: relative;
  padding: 10px;
  font-size: 18px;
  color: #555;
  text-align: left;
  cursor: pointer;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);

  .position {
    display: inline-block;
    min-width: 30px;
    margin-right: 7px;
    padding: 0 10px;
    color: white;
    text-align: center;
  }

  .collapsible {
    display: inline-block;
    width: 13px;
    color: #bbb;
    font-size: 16px;
  }

  .activity-name {
    display: block;
    width: 100%;
    height: 45px;
    position: absolute;
    top: 0;
    left: 0;
    padding: 10px 60px 0 75px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .actions {
    position: relative;
    padding-right: 5px;
    font-size: 20px;
    color: #999;

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
  margin-left: 50px;
}
</style>
