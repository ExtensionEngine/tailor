<template>
  <div class="perspective">
    <div class="actions">
      <span class="pull-right">
        <span @click="deletePerspective" class="action">
          <span class="mdi mdi-delete"></span>
        </span>
      </span>
    </div>
    <div v-if="!teachingElements.length" class="well">
      Click the button below to Create your first teaching element.
    </div>
    <draggable
      :list="teachingElements"
      :options="dragOptions"
      @update="reorder"
      @start="e => dragStart(e.oldIndex)"
      @end="dragEnd"
      class="row">
      <teaching-element
        v-for="(element, index) in teachingElements"
        @dragstart="dragStart(index)"
        @dragend="dragEnd"
        :dragged="dragElementIndex === index"
        :element="element"
        :key="element._cid">
      </teaching-element>
    </draggable>
    <add-element
      :activity="perspective"
      :position="nextPosition"
      :include="elementTypes"
      :layout="true"
      @add="addElement">
    </add-element>
  </div>
</template>

<script>
import AddElement from './AddElement';
import Draggable from 'vuedraggable';
import EventBus from 'EventBus';
import filter from 'lodash/filter';
import last from 'lodash/last';
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
import TeachingElement from '../teaching-elements';

const appChannel = EventBus.channel('app');

export default {
  name: 'perspective',
  props: ['perspective'],
  data() {
    return {
      dragElementIndex: -1,
      dragOptions: { handle: '.drag-handle' },
      elementTypes: [
        'HTML',
        'IMAGE',
        'VIDEO',
        'EMBED',
        'ASSESSMENT',
        'BREAK',
        'ACCORDION',
        'CAROUSEL',
        'MODAL',
        'TABLE',
        'PDF'
      ]
    };
  },
  computed: {
    ...mapGetters(['tes']),
    teachingElements() {
      return filter(this.tes, { activityId: this.perspective.id })
        .sort((a, b) => a.position - b.position);
    },
    nextPosition() {
      const element = last(this.teachingElements);
      return element ? element.position + 1 : 1;
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
    dragStart(index) {
      this.dragElementIndex = index;
    },
    dragEnd() {
      this.dragElementIndex = -1;
    },
    addElement(element) {
      this.saveElement(element);
      this.focusElement(element);
    },
    deletePerspective() {
      appChannel.emit('showConfirmationModal', {
        type: 'perspective',
        item: this.perspective,
        action: () => this.remove(this.perspective)
      });
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
  margin: 25px 0;
  padding: 20px 40px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.3);
}

.actions {
  width: 100%;
  min-height: 36px;
  font-size: 22px;

  .action {
    padding: 0 10px;
    color: #707070;
  }

  .action:hover {
    color: #444;
    cursor: pointer;
  }
}
</style>
