<template>
  <div class="tce-accordion-toolbar">
    <v-btn @click="add" tile text>
      <v-icon small left>mdi-plus</v-icon> Add item
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'tce-accordion-toolbar',
  inject: ['$elementBus'],
  props: {
    element: { type: Object, required: true }
  },
  methods: {
    add() {
      this.$elementBus.emit('add');
    }
  }
};
</script>

<style lang="scss" scoped>
.tce-accordion-toolbar {
  position: relative;
  width: 100%;
  height: 48px;

  .v-btn {
    float: left;
    height: 100%;
    margin-left: 10px;
  }
}
</style>
