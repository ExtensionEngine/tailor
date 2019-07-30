<template>
  <div class="group-introduction">
    <element-list
      @add="$emit('saveElement', $event)"
      @reorder="$emit('reorderElement', $event)"
      :elements="introductionElements"
      :activity="group"
      :supported-types="['HTML', 'IMAGE', 'VIDEO', 'EMBED']"
      :layout="true">
      <contained-content
        slot="list-item"
        slot-scope="{ element, dragged }"
        @save="save(element, $event)"
        @delete="$emit('deleteElement', element)"
        :element="element"
        :set-width="false"
        :is-dragged="dragged" />
    </element-list>
  </div>
</template>

<script>
import { ContainedContent, ElementList } from 'tce-core';
import cloneDeep from 'lodash/cloneDeep';
import filter from 'lodash/filter';
import { isQuestion } from 'tce-core/utils';

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
