<template>
  <div class="accordion-toolbar-container">
    <div class="navigation-sidebar">
    </div>
    <div class="accordion-action">
      <v-btn @click="add" text>
        <v-icon small>mdi-plus</v-icon>
        Add item
      </v-btn>
    </div>
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
.accordion-toolbar-container {
  display: flex;
  flex-wrap: wrap;
  height: 2.8125rem;

  .navigation-sidebar {
    display: flex;
    width: 25rem;
  }

  .accordion-action {
    display: flex;
    flex-grow: 1;
    justify-content: center;
    align-items: center;
  }
}
</style>
