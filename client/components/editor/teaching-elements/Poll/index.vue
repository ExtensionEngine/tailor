<template>
  <div class="te-poll">
    <div class="poll-container">
      <h2>Poll</h2>
      <div :class="{ 'name-error': nameError }" class="name">
        <input
          v-model="name"
          type="text"
          placeholder="Name...">
      </div>
      <h4>Question</h4>
      <div class="question">
        <div class="row">
          <primitive
            :key="question.id"
            :initialElement="question"
            @save="saveQuestion"/>
        </div>
      </div>
      <div class="options-heading">
        <h4>Options</h4>
        <button @click="addOption" class="btn">Add Option</button>
      </div>
      <div class="options">
        <draggable
          :list="options"
          :options="dragOptions"
          @update="reorderOption"
          class="row">
          <primitive
            v-for="option in options"
            :key="option.id"
            :initialElement="option"
            :drag="true"
            @save="saveOption"/>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script>
import calculatePosition from 'utils/calculatePosition.js';
import cuid from 'cuid';
import cloneDeep from 'lodash/cloneDeep';
import Draggable from 'vuedraggable';
import EventBus from 'EventBus';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import last from 'lodash/last';
import { mapActions } from 'vuex-module';
import Primitive from '../Primitive';
import set from 'lodash/set';
import size from 'lodash/size';
import sortBy from 'lodash/sortBy';

const appChannel = EventBus.channel('app');
const getTextElement = () =>
  ({ id: cuid(), type: 'HTML', embedded: true, data: { width: 12 } });

export default {
  name: 'te-poll',
  props: {
    element: { type: Object, required: true },
    isFocused: { type: Boolean, default: false }
  },
  data() {
    return {
      dragOptions: { handle: '.drag-handle' }
    };
  },
  computed: {
    name: {
      get() {
        const element = cloneDeep(this.element);
        return element.data.name;
      },
      set(name) {
        const element = cloneDeep(this.element);
        element.data.name = name;
        this.save(element);
      }
    },
    embeds() {
      return get(this.element, 'data.embeds', {});
    },
    question() {
      return this.embeds[this.element.data.question];
    },
    options() {
      const { embeds, options } = this.element.data;
      return sortBy(filter(embeds, it => options.includes(it.id)), 'position');
    },
    embedsTotal() {
      return size(this.embeds);
    },
    nameError() {
      return this.isFocused && !this.name;
    }
  },
  methods: {
    ...mapActions(['save'], 'tes'),
    saveQuestion(question) {
      const element = cloneDeep(this.element);
      element.data.question = question.id;
      set(element.data.embeds, question.id, question);
      this.save(element);
    },
    saveOption(option) {
      const element = cloneDeep(this.element);
      element.data.options = element.data.options || [];
      const existing = find(this.options, { id: option.id });
      set(element.data.embeds, option.id, option);
      if (!existing) {
        element.data.options.push(option.id);
      }
      this.save(element);
    },
    addOption() {
      const nextPosition = Math.ceil(get(last(this.options), 'position', 0) + 1);
      const option = { ...getTextElement(), position: nextPosition };
      this.saveOption(option);
    },
    reorderOption({ newIndex: newPosition }) {
      const items = cloneDeep(this.options);
      const isFirstChild = newPosition === 0;
      const context = { items, newPosition, isFirstChild };
      const newItemPosition = calculatePosition(context);
      const item = cloneDeep(items[newPosition]);
      item.position = newItemPosition;
      this.saveOption(item);
    }
  },
  created() {
    appChannel.on('deleteElement', item => {
      const element = cloneDeep(this.element);
      if (!item.embedded) return;
      if (item.id === this.question.id) return;
      if (!this.embedsTotal || this.embedsTotal < 4) return;
      if (!element.data.embeds[item.id]) return;
      delete element.data.embeds[item.id];
      this.save(element);
    });
  },
  components: { Draggable, Primitive }
};
</script>

<style lang="scss" scoped>
.te-poll {
  min-height: 200px;
  margin: 10px auto;
  padding: 10px 30px 30px;
}

.poll-container {
  clear: both;
  width: 100%;
  text-align: left;

  h2 {
    padding-bottom: 20px;
    text-align: center;
  }
}

.name {
  margin: 0 10px 30px;

  input {
    width: 100%;
    height: 40px;
  }

  &.name-error input {
    box-shadow: inset 0 -2px 0 #e51c23;
  }
}

.question, .options {
  padding: 10px;
  font-size: 22px;
  text-align: center;
}

.question {
  margin-bottom: 30px;
}

.options-heading {
  display: flex;
  justify-content: space-between;
  margin-right: 10px;
}
</style>
