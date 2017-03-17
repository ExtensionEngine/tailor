<template>
  <div class="accordion-toolbar">
    <ul>
      <li
        class="btn btn-link btn-sm"
        @click="add">
        <span class="mdi mdi-plus-circle"></span>Add item
      </li>
    </ul>
  </div>
</template>

<script>
import EventBus from 'EventBus';

const teChannel = EventBus.channel('te');

export default {
  name: 'accordion-toolbar',
  props: ['element'],

  methods: {
    add() {
      teChannel.emit(`addAccordionItem/${this.element.id}`);
    }
  }
};
</script>

<style lang="scss" scoped>
.accordion-toolbar {
  position: relative;
  width: 100%;
  height: 48px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.34);

  ul {
    float: left;
    height: 100%;
    margin: 0;
    padding: 0 30px 0 10px;

    li {
      height: 100%;
      padding-top: 15px;
      color: #444;

      .mdi {
        display: inline-block;
        margin-right: 5px;
        font-size: 20px;
        line-height: 20px;
        vertical-align: middle;
      }

      &.active {
        background-color: #e8e8e8;
      }
    }
  }
}
</style>
