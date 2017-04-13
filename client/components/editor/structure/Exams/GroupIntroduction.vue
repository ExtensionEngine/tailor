<template>
  <div class="group-introduction">
    <draggable
      :list="introductionElements"
      :options="dragOptions"
      @update="reorder"
      class="row">
      <teaching-element
        v-for="element in introductionElements"
        :element="element"
        :key="element._cid">
      </teaching-element>
    </draggable>
    <add-element
      :activity="group"
      :position="introductionElements.length + 1"
      :include="['HTML', 'IMAGE', 'VIDEO', 'EMBED']"
      :layout="true"
      @add="saveElement">
    </add-element>
  </div>
</template>

<script>
import AddElement from '../AddElement';
import Draggable from 'vuedraggable';
import filter from 'lodash/filter';
import { mapActions, mapGetters } from 'vuex-module';
import TeachingElement from '../../teaching-elements';

export default {
  name: 'group-introduction',
  props: ['group'],
  data() {
    return {
      dragOptions: { handle: '.drag-handle' }
    };
  },
  computed: {
    ...mapGetters(['tes']),
    introductionElements() {
      let cond = it => it.activityId === this.group.id && it.type !== 'ASSESSMENT';
      return filter(this.tes, cond).sort((a, b) => a.position - b.position);
    }
  },
  methods: {
    ...mapActions({ reorderElements: 'reorder', saveElement: 'save' }, 'tes'),
    reorder({ newIndex: newPosition }) {
      const items = this.teachingElements;
      const element = items[newPosition];
      const isFirstChild = newPosition === 0;
      const context = { items, newPosition, isFirstChild };
      this.reorderElements({ element, context });
    }
  },
  components: {
    AddElement,
    Draggable,
    TeachingElement
  }
};
</script>

<style lang="scss" scoped>
.group-introduction {
  min-height: 150px;
  margin: 30px 0 30px 0;
  padding: 5px 15px;
}
</style>
