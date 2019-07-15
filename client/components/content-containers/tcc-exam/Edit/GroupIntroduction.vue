<template>
  <div class="group-introduction">
    <element-list
      :elements="introductionElements"
      :activity="group"
      :supportedTypes="['HTML', 'IMAGE', 'VIDEO', 'EMBED']"
      :layout="true"
      @add="$emit('saveElement', $event)"
      @update="reorder">
      <teaching-element
        slot="list-item"
        slot-scope="{ element, dragged }"
        :setWidth="false"
        :dragged="dragged"
        :element="element"/>
    </element-list>
  </div>
</template>

<script>
import { ElementList } from 'tce-core';
import filter from 'lodash/filter';
import { isQuestion } from 'tce-core/utils';
import TeachingElement from '../../../editor/TeachingElement';

export default {
  name: 'group-introduction',
  props: {
    group: { type: Object, required: true },
    tes: { type: Object, required: true }
  },
  computed: {
    introductionElements() {
      let cond = it => it.activityId === this.group.id && !isQuestion(it.type);
      return filter(this.tes, cond).sort((a, b) => a.position - b.position);
    }
  },
  methods: {
    reorder({ newIndex: newPosition }) {
      const items = this.introductionElements;
      const element = items[newPosition];
      const isFirstChild = newPosition === 0;
      const context = { items, newPosition, isFirstChild };
      this.$emit('reorderElement', { element, context });
    }
  },
  components: {
    ElementList,
    TeachingElement
  }
};
</script>

<style lang="scss" scoped>
.group-introduction {
  min-height: 150px;
  margin: 30px 0;
  padding: 5px 15px;
}
</style>
