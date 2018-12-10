<template>
  <div>
    <div class="activity-wrapper">
      <div
        :class="{ selected: isSelected(_cid) }"
        @click="focusActivity(_cid)"
        class="activity">
        <span :style="{ 'background-color': color }" class="position">
          {{ index }}
        </span>
        <span class="activity-name">{{ data.name }}</span>
        <div class="actions">
          <button @click.stop="toggleActivity({ _cid })" class="collapsible">
            <span :class="toggleIcon"></span>
          </button>
        </div>
      </div>
      <insert-activity
        :anchor="{ id, courseId, parentId, type, position }"
        @expand="toggleActivity({ _cid, expanded: true })"/>
    </div>
    <div v-if="!isCollapsed({ _cid }) && hasChildren">
      <draggable
        :list="children"
        :options="{ handle: '.activity' }"
        @update="data => reorder(data, children)">
        <activity
          v-for="(subActivity, index) in children"
          v-bind="subActivity"
          :key="subActivity._cid"
          :index="index + 1"
          :level="level + 1"
          :activities="activities"
          class="sub-activity"/>
      </draggable>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex-module';
import Draggable from 'vuedraggable';
import filter from 'lodash/filter';
import find from 'lodash/find';
import InsertActivity from './InsertActivity';
import map from 'lodash/map';
import reorderMixin from './reorderMixin';

export default {
  name: 'activity',
  mixins: [reorderMixin],
  props: {
    _cid: { type: String, required: true },
    id: { type: Number, default: null },
    courseId: { type: Number, required: true },
    parentId: { type: Number, default: null },
    level: { type: Number, required: true },
    index: { type: Number, required: true },
    position: { type: Number, required: true },
    type: { type: String, required: true },
    data: { type: Object, required: true },
    activities: { type: Array, default: () => ([]) }
  },
  computed: {
    ...mapGetters({
      structure: 'structure',
      focusedActivity: 'activity',
      isCollapsed: 'isCollapsed'
    }, 'course'),
    color() {
      return find(this.structure, { type: this.type }).color;
    },
    hasChildren() {
      return (this.children.length > 0) && (this.level < this.structure.length);
    },
    children() {
      const level = this.level + 1;
      const types = map(filter(this.structure, { level }), 'type');
      return filter(this.activities, it => {
        return this.id && (this.id === it.parentId) && types.includes(it.type);
      }).sort((x, y) => x.position - y.position);
    },
    toggleIcon() {
      if (!this.hasChildren) return '';
      const isCollapsed = this.isCollapsed({ _cid: this._cid });
      return isCollapsed ? 'mdi mdi-chevron-down' : 'mdi mdi-chevron-up';
    }
  },
  methods: {
    ...mapMutations(['focusActivity', 'toggleActivity'], 'course'),
    isSelected(_cid) {
      return this.focusedActivity._cid === _cid;
    }
  },
  components: { Draggable, InsertActivity }
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
