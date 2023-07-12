<template>
  <div class="group-introduction">
    <element-list
      @add="$emit('save:element', $event)"
      @update="$emit('reorder:element', $event)"
      :elements="introductionElements"
      :activity="group"
      :supported-types="['JODIT_HTML', 'IMAGE', 'VIDEO', 'EMBED', 'HTML']"
      :layout="true">
      <template #list-item="{ element, dragged }">
        <contained-content
          @save="save(element, $event)"
          @delete="$emit('delete:element', element)"
          :element="element"
          :set-width="false"
          :is-dragged="dragged" />
      </template>
    </element-list>
  </div>
</template>

<script>
import { ContainedContent, ElementList } from '@tailor-cms/core-components';
import cloneDeep from 'lodash/cloneDeep';
import filter from 'lodash/filter';
import { isQuestion } from '@tailor-cms/utils';
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
      this.$emit('save:element', element);
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
  margin: 30px 0;
  min-height: 150px;
  padding: 5px 15px;
}
</style>
