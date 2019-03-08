<template>
  <div class="tce-poll">
    <div class="poll-container">
      <span class="mdi mdi-poll pull-right"></span>
      <div :class="{ 'has-error': isFocused && !name }" class="form-group name">
        <label for="`${element._cid}pollName`">Poll name</label>
        <input
          v-model="name"
          @focusout="updateName"
          id="`${element._cid}pollName`"
          type="text"
          class="form-control"
          placeholder="Poll name...">
      </div>
      <div class="question row">
        <div class="col-xs-12">
          <h4>Question</h4>
          <content-element
            :element="question"
            :isDisabled="false"
            :frame="true"
            @save="data => saveQuestion(data)"/>
        </div>
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
          :class="{ 'has-error': isFocused && !option.content }"
          class="option">
          <span class="option-index">{{ index + 1 }}</span>
          <input
            :ref="`input${option.id}`"
            :value="option.content"
            :name="option.id"
            @change="updateOption(option)"
            placeholder="Option..."
            class="option-input form-control">
          <span
            v-if="optionsTotal > 2"
            @click="removeOption(option)"
            class="mdi mdi-close control">
          </span>
        </div>
      </draggable>
    </div>
  </div>
</template>

<script>
import calculatePosition from 'utils/calculatePosition.js';
import cloneDeep from 'lodash/cloneDeep';
import { ContentElement } from 'tce-core';
import cuid from 'cuid';
import Draggable from 'vuedraggable';
import find from 'lodash/find';
import get from 'lodash/get';
import last from 'lodash/last';
import set from 'lodash/set';
import size from 'lodash/size';
import sortBy from 'lodash/sortBy';

const getInputElement = () => ({ id: cuid(), content: null });

export default {
  name: 'tce-poll',
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
      const options = cloneDeep(get(this.element, 'data.options'));
      return sortBy(options, 'position');
    },
    optionsTotal() {
      return size(this.options);
    }
  },
  methods: {
    updateName() {
      const elementData = cloneDeep(this.element.data);
      elementData.name = this.name;
      this.saveElement(elementData);
    },
    saveQuestion(data) {
      const elementData = cloneDeep(this.element.data);
      const question = elementData.embeds[this.question.id];
      question.data = data;
      elementData.embeds[this.question.id] = question;
      this.saveElement(elementData);
    },
    updateOption(option) {
      const existing = find(this.options, { id: option.id });
      if (!existing) return;
      existing.content = this.$refs[`input${option.id}`][0].value.trim();
      this.saveOption(existing);
    },
    saveOption(option) {
      const elementData = cloneDeep(this.element.data);
      set(elementData.options, option.id, option);
      this.saveElement(elementData);
    },
    addOption() {
      const nextPosition = Math.ceil(get(last(this.options), 'position', 0) + 1);
      const option = { ...getInputElement(), position: nextPosition };
      const existing = find(this.options, { id: option.id });
      if (!existing) this.saveOption(option);
    },
    removeOption(option) {
      const elementData = cloneDeep(this.element.data);
      const existing = find(this.options, { id: option.id });
      if (existing) delete elementData.options[option.id];
      this.saveElement(elementData);
    },
    reorderOption({ newIndex: newPosition }) {
      const items = cloneDeep(this.options);
      const isFirstChild = newPosition === 0;
      const context = { items, newPosition, isFirstChild };
      const newItemPosition = calculatePosition(context);
      const item = cloneDeep(items[newPosition]);
      item.position = newItemPosition;
      this.saveOption(item);
    },
    saveElement(data) {
      this.$emit('save', data);
    }
  },
  components: { Draggable, ContentElement }
};
</script>

<style lang="scss" scoped>
$label-color: #3f51b5;

.tce-poll {
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
  position: relative;

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
    width: 100%;
    margin: 10px 0 10px 20px;
  }

  .mdi-close {
    position: absolute;
    right: 0;
    bottom: 5px;
    padding: 5px;
    color: #888;
    cursor: pointer;

    &:hover {
      color: darken(#888, 20%);
    }
  }
}
</style>
