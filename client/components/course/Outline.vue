<template>
  <div>
    <draggable :activities="activities" @start="dragging=true" @end="dragging=false">
      <activity v-for="it in activities" :name="it.name"></activity>
    </draggable>
  </div>
</template>

<script>
import Activity from './Activity.vue';
import Draggable from 'vuedraggable';

export default {
  name: 'course-outline',
  data: function () {
    return {
      name: 'Javascript',
      activities: [
        { name: 'Introduction' },
        { name: 'Values, Types, and Operators' },
        { name: 'Program Structure' },
        { name: 'Functions' },
        { name: 'Data Structures: Objects and Arrays' },
        { name: 'Higher-Order Functions' },
        { name: 'The Secret Life of Objects' },
        { name: 'Bugs and Error Handling' }
      ]
    };
  },
  components: {
    Activity,
    Draggable
  }
};
</script>

<style lang="scss">

</style>
