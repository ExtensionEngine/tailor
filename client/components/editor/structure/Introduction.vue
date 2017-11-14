<template>
  <div>
    <h2>Introduction</h2>
    <div v-if="!introduction">
      <button @click="addIntroduction" class="btn btn-primary">
        <span class="mdi mdi-plus"></span>
        Create introduction
      </button>
    </div>
    <div v-else class="introduction">
      <div class="actions">
        <span @click="deleteIntroduction" class="pull-right">
          <span class="mdi mdi-delete"></span>
        </span>
      </div>
      <div v-if="!teachingElements.length" class="well">
        Click the button below to Create introductory content.
      </div>
      <tes-list
        :list="teachingElements"
        :activity="introduction"
        :types="['HTML', 'IMAGE', 'VIDEO']"
        :layout="true"
        @add="saveElement"
        @update="reorder">
        <teaching-element
          slot="list-item"
          slot-scope="{ item, dragged }"
          :dragged="dragged"
          :element="item">
        </teaching-element>
      </tes-list>
    </div>
  </div>
</template>

<script>
import EventBus from 'EventBus';
import filter from 'lodash/filter';
import { mapActions, mapGetters } from 'vuex-module';
import TeachingElement from '../teaching-elements';
import TesList from './TesList';

const appChannel = EventBus.channel('app');

export default {
  name: 'introduction',
  computed: {
    ...mapGetters(['tes']),
    ...mapGetters(['activity', 'introduction'], 'editor'),
    teachingElements() {
      return filter(this.tes, { activityId: this.introduction.id })
        .sort((a, b) => a.position - b.position);
    }
  },
  methods: {
    ...mapActions(['save', 'remove'], 'activities'),
    ...mapActions({ reorderElements: 'reorder', saveElement: 'save' }, 'tes'),
    reorder({ newIndex: newPosition }) {
      const items = this.teachingElements;
      const element = items[newPosition];
      const isFirstChild = newPosition === 0;
      const context = { items, newPosition, isFirstChild };
      this.reorderElements({ element, context });
    },
    addIntroduction() {
      this.save({ type: 'INTRO', parentId: this.activity.id, position: 1 });
    },
    deleteIntroduction() {
      appChannel.emit('showConfirmationModal', {
        type: 'introduction',
        item: this.introduction,
        action: () => this.remove(this.introduction)
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
h2 {
  margin: 50px 0 20px;
  padding: 0;
  color: #444;
  font-size: 18px;
  text-align: left;
}

.introduction {
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
  color: #707070;
  font-size: 22px;

  > span {
    padding: 0 10px;
  }

  > span:hover {
    color: #444;
    cursor: pointer;
  }
}
</style>
