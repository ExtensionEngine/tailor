<template>
  <div class="group-introduction">
    <element-list
      @add="$emit('saveElement', $event)"
      @update="$emit('reorderElement', $event)"
      :elements="introductionElements"
      :activity="group"
      :supported-types="['HTML', 'IMAGE', 'VIDEO', 'EMBED']"
      :layout="true">
      <template v-slot:list-item="{ element, dragged }">
        <contained-content
          @save="save(element, $event)"
          @delete="$emit('deleteElement', element)"
          :element="element"
          :set-width="false"
          :is-dragged="dragged" />
      </template>
    </element-list>
  </div>
</template>

<script>
import { ContainedContent, ElementList } from 'tce-core';
import cloneDeep from 'lodash/cloneDeep';
import filter from 'lodash/filter';
import { isQuestion } from 'tce-core/utils';
import sortBy from 'lodash/sortBy';

export default {
  name: 'group-introduction',
  props: {
    group: { type: Object, required: true },
    elements: { type: Object, required: true }
  },
  computed: {
    introductionElements() {
      const { group, elements } = this;
      const cond = it => it.activityId === group.id && !isQuestion(it.type);
      return sortBy(filter(elements, cond), 'position');
    }
  },
  methods: {
    save(element, data) {
      element = cloneDeep(element);
      Object.assign(element.data, data);
      this.$emit('saveElement', element);
    }
  },
  components: {
    ContainedContent,
    ElementList
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
