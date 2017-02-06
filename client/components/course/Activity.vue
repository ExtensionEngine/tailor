<template>
  <div>
    <div class="activity-wrapper" v-if="!isRoot">
      <div class="activity" @click="select" @dblclick="edit">
        <span class="position" :style="{ 'background-color': color }">
          {{ index + 1 }}
        </span>
        <span class="collapsible" :class="collapsibleIcon"></span>
        <span>{{ name }}</span>
        <span class="pull-right">
          <span class="badge" v-if="showBadge">{{ children.length }}</span>
        </span>
      </div>
      <insert-activity :parent="activity" :level="level"></insert-activity>
    </div>
    <transition name="fade" v-if="!isCollapsed && hasChildren">
      <draggable @update="reorder" :list="children">
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
    </transition>
    <no-activities v-if="isRoot && !hasChildren"></no-activities>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex-module';
import Draggable from 'vuedraggable';
import InsertActivity from './InsertActivity';
import NoActivities from './NoActivities';
import values from 'lodash/values';

const MAX_LEVELS = 3;
const COLORS = ['#42A5F5', '#66BB6A', '#EC407A'];

export default {
  name: 'activity',
  props: ['_cid', 'id', 'name', 'position', 'level', 'activities', 'activity', 'index'],
  data() {
    return {
      isCollapsed: this.level !== 0
    };
  },
  computed: {
    showBadge() {
      return this.hasChildren && this.isCollapsed;
    },
    isRoot() {
      return this.level === 0;
    },
    isAtom() {
      return this.level === MAX_LEVELS;
    },
    color() {
      let index = this.level - 1;
      return index > COLORS.length ? '#555' : COLORS[index];
    },
    hasChildren() {
      return this.children.length > 0 && this.level < MAX_LEVELS;
    },
    children() {
      const filterByParent = this.isRoot
        ? act => !act.parentId
        : act => this.id && this.id === act.parentId;

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
    ...mapMutations(['focusActivity'], 'editor'),
    ...mapActions({ reorderActivities: 'reorder' }, 'activity'),
    select() {
      this.isCollapsed = !this.isCollapsed;
      this.focusActivity(this._cid);
    },
    edit() {
      if (!this.isAtom) return;
      this.$router.push({
        name: 'editor',
        params: { activityKey: this.activity.id }
      });
    },
    reorder({ newIndex: index }) {
      const activity = this.children[index];
      const positionData = {
        index,
        prev: this.children[index - 1],
        next: this.children[index + 1],
        first: this.children[1],
        count: this.children.length,
        sameLevel: true,
        reorder: true
      };

      this.reorderActivities({ activity, positionData, index });
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

  .badge {
    margin-right: 10px;
    padding: 4px 10px;
    color: #777;
    background-color: #eee;
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

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s
}

.fade-enter, .fade-leave-active {
  opacity: 0
}
</style>
