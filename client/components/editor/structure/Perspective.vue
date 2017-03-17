<template>
  <div class="perspective">
    <div class="actions">
      <span @click="remove(perspective)" class="pull-right">
        <span class="fa fa-trash"></span>
      </span>
    </div>
    <div v-if="!teachingElements.length" class="well">
      Click the button below to Create your first teaching element.
    </div>
    <draggable
      :list="teachingElements"
      :options="dragOptions"
      @update="reorder"
      class="row">
      <teaching-element
        v-for="element in teachingElements"
        :element="element"
        :key="element._cid">
      </teaching-element>
    </draggable>
    <add-element
      :activity="perspective"
      :position="teachingElements.length + 1"
      :include="['HTML', 'IMAGE', 'VIDEO', 'EMBED', 'BREAK']"
      :layout="true"
      @add="addElement">
    </add-element>
  </div>
</template>

<script>
import AddElement from './AddElement';
import Draggable from 'vuedraggable';
import filter from 'lodash/filter';
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
import TeachingElement from '../teaching-elements';

export default {
  name: 'perspective',
  props: ['perspective'],
  data() {
    return {
      dragOptions: { forceFallback: true }
    };
  },
  computed: {
    ...mapGetters(['tes']),
    teachingElements() {
      return filter(this.tes, { activityId: this.perspective.id })
        .sort((a, b) => a.position - b.position);
    }
  },
  methods: {
    ...mapActions(['remove'], 'activities'),
    ...mapActions({ reorderElements: 'reorder', saveElement: 'save' }, 'tes'),
    ...mapMutations(['focusElement'], 'editor'),
    reorder({ newIndex: newPosition }) {
      const items = this.teachingElements;
      const element = items[newPosition];
      const isFirstChild = newPosition === 0;
      const context = { items, newPosition, isFirstChild };
      this.reorderElements({ element, context });
    },
    addElement(element) {
      this.saveElement(element);
      this.focusElement(element);
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
.perspective {
  width: 100%;
  min-height: 245px;
  margin: 25px 0px;
  padding: 20px 40px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.30);
}

.actions {
  width: 100%;
  min-height: 36px;
  font-size: 20px;
  color: #707070;

  > span {
    padding: 0 10px;
  }

  > span:hover {
    cursor: pointer;
    color: #444;
  }
}
</style>
