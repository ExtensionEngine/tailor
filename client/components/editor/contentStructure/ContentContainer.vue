<template>
  <div class="content-container">
    <transition name="fade">
      <draggable>
        <content-row v-for="it in assets">{{ it }}</content-row>
      </draggable>
    </transition>
  </div>
</template>

<script>
import Draggable from 'vuedraggable';
import ContentRow from './ContentRow';

export default {
  name: 'content-container',
  data() {
    return {
      assets: ['Test', 'One', 'Two']
    };
  },
  components: {
    ContentRow,
    Draggable
  }
};
</script>

<style lang="scss">
</style>
