<template>
  <div>
    <div class="activity"
      v-if="name"
      @click="collapsed =! collapsed">
      <div>{{ name }}</div>
    </div>
    <transition name="fade">
      <draggable
        v-if="!collapsed"
        @start="dragging = true"
        @end="dragging = false">
        <activity
          v-bind:class="{ 'sub-activity': name }"
          v-for="it in activities"
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
  props: ['name', 'activities'],
  data: function () {
    return {
      collapsed: false
    };
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

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s
}

.fade-enter, .fade-leave-active {
  opacity: 0
}
</style>
