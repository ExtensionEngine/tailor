<template>
  <div>
    <div class="activity" v-if="name">
      <div>{{ name }}</div>
    </div>
    <draggable :activities="activities" @start="dragging=true" @end="dragging=false">
      <activity
        v-bind:class="{ 'sub-activity': name }"
        v-for="it in activities"
        :name="it.name"
        :activities="it.activities">
      </activity>
    </draggable>
  </div>
</template>

<script>
import Draggable from 'vuedraggable';

export default {
  name: 'activity',
  props: ['name', 'activities'],
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
</style>
