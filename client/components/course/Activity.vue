<template>
  <div>
    <div class="activity-wrapper" v-if="!isRoot">
      <div class="activity" @click="select">
        <span class="order" :style="{ 'background-color': color }">{{ order }}</span>
        <span class="collapsible" :class="collapsibleIcon"></span>
        <span>{{ name }}</span>
        <span class="pull-right">
          <span class="badge" v-if="showBadge">{{ children.length }}</span>
        </span>
      </div>
      <insert-activity :parent="activity"></insert-activity>
    </div>
    <transition name="fade" v-if="!collapsed">
      <draggable @update="reorder">
        <activity
          v-for="it in children"
          :key="it._cid"
          :_cid="it._cid"
          :name="it.name"
          :order="it.order"
          :level="level + 1"
          :class="{ 'sub-activity': name }"
          :activities="activities"
          :activity="it">
        </activity>
      </draggable>
    </transition>
  </div>
</template>

<script>
import Draggable from 'vuedraggable';
import InsertActivity from './InsertActivity';
import { mapActions, mapMutations } from 'vuex-module';
import values from 'lodash/values';

const COLORS = ['#29B6F6', '#8BC34A', '#EF5350'];

export default {
  name: 'activity',
  props: ['_cid', 'name', 'order', 'level', 'activities', 'activity'],
  data() {
    return {
      collapsed: this.level !== 0
    };
  },
  computed: {
    showBadge() {
      return this.hasChildren && this.collapsed;
    },
    isRoot() {
      return this.level === 0;
    },
    color() {
      let index = this.level - 1;
      return index > COLORS.length ? '#555' : COLORS[index];
    },
    hasChildren() {
      return this.children.length > 0;
    },
    children() {
      let activities = values(this.activities);
      return activities
        .filter(it => it.parentKey === this._cid)
        .sort((a, b) => a.order - b.order);
    },
    collapsibleIcon() {
      return {
        'fa fa-caret-right': this.collapsed && this.hasChildren,
        'fa fa-caret-down': !this.collapsed && this.hasChildren
      };
    }
  },
  methods: {
    ...mapMutations(['focusActivity'], 'editor'),
    ...mapActions({ reorderActivities: 'reorder' }, 'activities'),
    select() {
      this.collapsed = !this.collapsed;
      this.focusActivity(this._cid);
    },
    reorder({ newIndex: to, item: { __vue__: { order: from } } }) {
      // 0 based array pos
      to += 1;
      this.reorderActivities({ from, to, parentKey: this._cid });
    }
  },
  components: {
    Draggable,
    InsertActivity
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

  .order {
    margin-right: 7px;
    padding: 0 10px;
    display: inline-block;
    color: white;
  }

  .collapsible {
    display: inline-block;
    width: 13px;
    color: #bbb;
    font-size: 16px;
  }

  .badge {
    margin: 6px 10px;
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
      right: -50px;
      bottom: -26px;
      width: 50px;
      height: 50px;
      padding-left: 13px;
      line-height: 50px;
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
