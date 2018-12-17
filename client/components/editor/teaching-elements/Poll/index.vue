<template>
  <div class="te-poll">
    <div class="poll-container">
      <span class="mdi mdi-poll pull-right"></span>
      <div :class="{ 'has-error': nameError }" class="form-group name">
        <label for="`${element._cid}pollName`">Poll name</label>
        <input
          v-model="name"
          id="`${element._cid}pollName`"
          type="text"
          class="form-control"
          placeholder="Poll name...">
      </div>
      <div class="question row">
        <div class="col-xs-12">
          <h4>Question</h4>
        </div>
        <primitive
          :key="question.id"
          :initialElement="question"
          @save="saveQuestion"/>
      </div>
      <div class="options-heading">
        <h4>Options</h4>
        <button @click="addOption" class="btn btn-default btn-material">
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
  name: 'te-poll',
  props: {
    element: { type: Object, required: true },
    isFocused: { type: Boolean, default: false }
  },
  data() {
    return {
      dragOptions: { handle: '.option-index' }
    };
  },
  computed: {
    name: {
      get() {
        return this.element.data.name;
      },
      set(name) {
        const data = { ...this.element.data, name };
        this.save({ ...this.element, data });
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
$label-color: #3f51b5;

.te-poll {
  margin: 10px auto;
  padding: 10px 30px 20px;
}

.poll-container {
  width: 100%;
  text-align: left;
}

.mdi-poll {
  color: $label-color;
  font-size: 20px;
}

h4 {
  font-size: 16px;
  text-align: left;
}

.question {
  margin-top: 20px;
  text-align: center;
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
    width: 20px;
    height: $min-height;
    margin: 8px $min-height / 2 0 0;
    padding: 0 0 0 4px;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    line-height: $min-height;
    text-align: center;
    background: $label-color;
    cursor: pointer;

    &::after {
      $height: $min-height / 2;
      content: '';
      position: absolute;
      top: 0;
      right: -$height;
      border-top: $height solid transparent;
      border-left: $height solid $label-color;
      border-bottom: $height solid transparent;
    }
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
