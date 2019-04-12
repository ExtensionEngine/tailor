<template>
  <div class="group-introduction">
    <tes-list
      :list="introductionElements"
      :activity="group"
      :types="['HTML', 'IMAGE', 'VIDEO', 'EMBED']"
      :layout="true"
      @add="saveElement"
      @update="reorder">
      <teaching-element
        slot="list-item"
        slot-scope="{ item, dragged, setWidth, setMargin }"
        :setWidth="setWidth"
        :setMargin="setMargin"
        :dragged="dragged"
        :element="item">
      </teaching-element>
    </tes-list>
  </div>
</template>

<script>
import filter from 'lodash/filter';
import { isQuestion } from 'tce-core/utils';
import { mapActions, mapGetters } from 'vuex-module';
import TeachingElement from '../../TeachingElement';
import TesList from '../TesList';

export default {
  name: 'group-introduction',
  props: {
    group: { type: Object, required: true }
  },
  computed: {
    ...mapGetters(['tes']),
    introductionElements() {
      let cond = it => it.activityId === this.group.id && !isQuestion(it.type);
      return filter(this.tes, cond).sort((a, b) => a.position - b.position);
    }
  },
  methods: {
    ...mapActions({ reorderElements: 'reorder', saveElement: 'save' }, 'tes'),
    reorder({ newIndex: newPosition }) {
      const items = this.introductionElements;
      const element = items[newPosition];
      const isFirstChild = newPosition === 0;
      const context = { items, newPosition, isFirstChild };
      this.reorderElements({ element, context });
    }
  },
  components: {
    TesList,
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
