<template>
  <div class="te-slider-reflection">
    <div class="reflection-container">
      <div class="reflection-heading">
        <h4>Slider Reflection</h4>
        <span class="mdi mdi-ray-start-end pull-right"></span>
      </div>
      <div class="question row">
        <primitive
          :key="question.id"
          :initialElement="question"
          @save="saveQuestion"/>
      </div>
      <div class="options-heading">
        <h4>Options</h4>
        <button
          v-if="optionsTotal < 5"
          @click="addOption"
          class="btn btn-default btn-material">
          Add Option
        </button>
      </div>
      <draggable
        :list="options"
        :options="dragOptions"
        @update="reorderOption"
        class="options row">
        <div
          v-for="(option, index) in options"
          :key="option.id"
          class="option">
          <span class="option-index">{{ index + 1 }}</span>
          <primitive
            :initialElement="option"
            @save="saveOption"
            class="option-input"/>
        </div>
      </draggable>
    </div>
  </div>
</template>

<script>
import calculatePosition from 'utils/calculatePosition.js';
import cloneDeep from 'lodash/cloneDeep';
import cuid from 'cuid';
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
  name: 'te-slider-reflection',
  props: {
    element: { type: Object, required: true },
    isFocused: { type: Boolean, default: false }
  },
  data() {
    return {
      name: get(this.element, 'data.name', ''),
      dragOptions: { handle: '.option-index' }
    };
  },
  computed: {
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
    optionsTotal() {
      return size(this.options);
    },
    nameError() {
      return this.isFocused && !this.name;
    }
  },
  methods: {
    ...mapActions(['save'], 'tes'),
    updateName() {
      const data = { ...this.element.data, name: this.name };
      this.save({ ...this.element, data });
    },
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
      if (!existing) element.data.options.push(option.id);
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
      if (item.id === this.question.id) {
        const question = cloneDeep(this.question);
        question.data.content = '';
        setTimeout(() => this.saveQuestion(question), 50);
        return;
      }
      if (!element.data.embeds[item.id]) return;
      delete element.data.embeds[item.id];
      this.save(element);
    });
  },
  components: { Draggable, Primitive }
};
</script>

<style lang="scss" scoped>
$label-color: #3f51b5;

.te-slider-reflection {
  margin: 10px auto;
  padding: 10px 30px 20px;
}

.reflection-container {
  width: 100%;
}

.reflection-heading {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.mdi-ray-start-end {
  color: $label-color;
  font-size: 20px;
}

.options {
  margin: 10px 2px;
  font-size: 22px;
}

.options-heading {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.option {
  $min-height: 30px;

  display: flex;

  &-index {
    position: relative;
    width: $min-height;
    height: $min-height;
    margin: 8px 0;
    padding: 4px 0;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    background: $label-color;
    border-radius: 50%;
    cursor: pointer;
  }

  &-input {
    flex: 1;

    /deep/ .teaching-element {
      $border-height: 2px;

      min-height: $min-height + $border-height;
      padding: 0;

      .ql-editor {
        min-height: $min-height;
        padding: 6px 10px;
      }

      .text-placeholder {
        display: none;
      }
    }
  }
}
</style>
