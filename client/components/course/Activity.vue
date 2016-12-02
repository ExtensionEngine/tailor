<template>
  <div>
    <div class="activity"
      v-if="name"
      @click="collapsed =! collapsed">
      <span class="order" :style="{ 'background-color': color }">{{ order }}</span>
      <span class="collapsible" :class="classObject"></span>
      <span>{{ name }}</span>
      <span class="badge pull-right" v-if="hasChildren && collapsed">{{ activities.length }}</span>
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
      collapsed: false
    };
  },
  computed: {
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
  margin: 10px 200px;
  padding: 5px;
  font-size: 22px;
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
