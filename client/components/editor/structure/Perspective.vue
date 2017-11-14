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
    <tes-list
      :list="teachingElements"
      :activity="perspective"
      :types="elementTypes"
      :layout="true"
      @add="addElement"
      @update="reorder">
      <teaching-element
        slot="list-item"
        slot-scope="{ item, dragged }"
        :dragged="dragged"
        :element="item">
      </teaching-element>
    </tes-list>
  </div>
</template>

<script>
import EventBus from 'EventBus';
import filter from 'lodash/filter';
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
import TeachingElement from '../teaching-elements';
import TesList from './TesList';

const appChannel = EventBus.channel('app');

export default {
  name: 'perspective',
  props: ['perspective'],
  data() {
    return {
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
        'TABLE'
      ]
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
    TesList,
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
