<template>
  <div>
    <div class="activity-wrapper" v-if="!isRoot">
      <div class="activity"
        @click="collapsed = !collapsed">
        <span class="order" :style="{ 'background-color': color }">{{ order }}</span>
        <span class="collapsible" :class="classObject"></span>
        <span>{{ name }}</span>
        <span class="pull-right">
          <span class="badge"
            v-if="hasChildren && collapsed">
            {{ activities.length }}
          </span>
        </span>
      </div>
      <div class="divider-wrapper">
        <div class="divider">
          <div class="action"><span class="fa fa-plus"></span></div>
        </div>
      </div>
    </div>
    <transition name="fade">
      <draggable
        v-if="!collapsed"
        :list=activities
        @start="dragging = true"
        @end="dragging = false">
        <activity
          v-bind:class="{ 'sub-activity': name }"
          v-for="it in activities"
          :level="level + 1"
          :order="it.order"
          :name="it.name"
          :activities="it.activities">
        </activity>
      </draggable>
    </transition>
  </div>
</template>

<script>
import Draggable from 'vuedraggable';

export default {
  name: 'activity',
  props: ['level', 'order', 'name', 'activities'],
  data: function () {
    return {
      collapsed: this.level !== 0
    };
  },
  computed: {
    isRoot: function () {
      return this.level === 0;
    },
    color: function () {
      // TODO: Externalize
      let colors = ['#29B6F6', '#8BC34A', '#EF5350'];
      let index = this.level - 1;
      return index > colors.length ? '#555' : colors[index];
    },
    hasChildren: function () {
      return this.activities && this.activities.length;
    },
    classObject: function () {
      return {
        'fa fa-caret-right': this.collapsed && this.hasChildren,
        'fa fa-caret-down': !this.collapsed && this.hasChildren
      };
    }
  },
  watch: {
    'activities': function (activities) {
      if (!activities) return;
      activities.forEach((it, index) => {
        it.order = index + 1;
      });
    }
  },
  components: {
    Draggable
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
  transition: all 2s cubic-bezier(.25,.8,.25,1);

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
