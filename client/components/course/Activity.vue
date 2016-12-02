<template>
  <div>
    <div class="activity"
      v-if="name"
      @click="collapsed =! collapsed">
      <span class="order">{{ order }}</span>
      <span class="collapsible" :class="classObject"></span>
      <span>{{ name }}</span>
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
  props: ['name', 'order', 'activities'],
  data: function () {
    return {
      collapsed: false
    };
  },
  computed: {
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
  color: red;
  text-align: left;
  background-color: #ccc;
  cursor: pointer;
}

.sub-activity {
  margin-left: 50px;
}

.order {
  margin-right: 7px;
  padding: 0 10px;
  display: inline-block;
  background-color: #f8f8f8;
}

.collapsible {
  display: inline-block;
  width: 13px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s
}

.fade-enter, .fade-leave-active {
  opacity: 0
}
</style>
