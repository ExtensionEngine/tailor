<template>
  <div :class="{ 'disabled': !isEditing }">
    <div class="row no-gutters heading">
      <div class="col-xs-offset-1 col-xs-4 heading-input-wrapper">
        <input v-model="premiseHeading" class="heading-input" type="text"/>
      </div>
      <div class="col-xs-2"></div>
      <div class="col-xs-4 heading-input-wrapper">
        <input v-model="responseHeading" class="col-xs-4 heading-input" type="text"/>
      </div>
    </div>
    <div v-for="(responseKey, premiseKey, index) in correct" class="row no-gutters">
      <div
        :class="{ 'flip': isFocused(premiseKey) }"
        class="col-xs-offset-1 col-xs-4 premise-container">
        <div @click="focus(premiseKey)" class="premise-view front">
          <span :class="hasError(premiseKey, 'premises')">
            {{ getPremiseContent(premiseKey) || 'Click to edit' }}
          </span>
        </div>
        <input
          v-focus="{ newKey: premiseKey }"
          :value="getPremiseContent(premiseKey)"
          @change="updatePremiseContent(premiseKey, $event)"
          @keyup.enter="focus(premiseKey)"
          @keyup.esc="focus(premiseKey)"
          @blur="isFocused(premiseKey) && focus(premiseKey)"
          class="form-control premise-input back"
          placeholder="Insert text here ...">
      </div>
      <div class="col-xs-2">
        <span class="mdi mdi-arrow-right"></span>
      </div>
      <div
        :class="{ 'flip': isFocused(responseKey) }"
        class="col-xs-4 response-container">
        <div @click="focus(responseKey)" class="response-view front">
          <span :class="hasError(responseKey, 'responses')">
            {{ getResponseContent(responseKey) || 'Click to edit' }}
          </span>
        </div>
        <input
          v-focus="{ newKey: responseKey }"
          :value="getResponseContent(responseKey)"
          @change="updateResponseContent(responseKey, $event)"
          @keyup.enter="focus(responseKey)"
          @keyup.esc="focus(responseKey)"
          @blur="isFocused(responseKey) && focus(responseKey)"
          class="form-control response-input back"
          placeholder="Insert text here ...">
      </div>
      <div class="col-xs-1 destroy">
        <span
          v-show="!minItems && isEditing"
          @click="removeItems(premiseKey, responseKey)"
          class="mdi mdi-close">
        </span>
      </div>
    </div>
    <div v-show="!maxItems && isEditing">
      <span @click="addItems" class="mdi mdi-plus"></span>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import cuid from 'cuid';
import keys from 'lodash/keys';
import shuffle from 'lodash/shuffle';
import pull from 'lodash/pull';

export default {
  directives: {
    focus: {
      update(el, binding, vnode) {
        const key = vnode.context.focused.key;
        const newKey = binding.value.newKey;
        if (key === newKey) {
          el.focus();
        } else {
          el.blur();
        }
      }
    }
  },
  props: {
    assessment: Object,
    errors: Array,
    isEditing: Boolean
  },
  data() {
    return {
      focused: { key: null },
      premiseHeading: this.assessment.headings.premise,
      responseHeading: this.assessment.headings.response
    };
  },
  computed: {
    premises() {
      return this.assessment.premises || {};
    },
    responses() {
      return this.assessment.responses || {};
    },
    correct() {
      return this.assessment.correct || {};
    },
    maxItems() {
      return keys(this.correct).length >= 10;
    },
    minItems() {
      return keys(this.correct).length <= 2;
    }
  },
  methods: {
    updatePremiseContent(key, evt) {
      let premises = cloneDeep(this.premises);
      this.getPremiseItem(key, premises).value = evt.target.value;
      this.update({ premises: shuffle(premises) });
    },
    updateResponseContent(key, evt) {
      let responses = cloneDeep(this.responses);
      this.getResponseItem(key, responses).value = evt.target.value;
      this.update({ responses: shuffle(responses) });
    },
    getResponseContent(key) {
      return this.getResponseItem(key).value;
    },
    getPremiseContent(key) {
      return this.getPremiseItem(key).value;
    },
    getPremiseItem(key, premises = this.premises) {
      return premises.find(it => it.key === key);
    },
    getResponseItem(key, responses = this.responses) {
      return responses.find(it => it.key === key);
    },
    removeItems(premiseKey, responseKey) {
      let premises = cloneDeep(this.premises);
      let responses = cloneDeep(this.responses);
      let correct = cloneDeep(this.correct);
      pull(premises, this.getPremiseItem(premiseKey, premises));
      pull(responses, this.getResponseItem(responseKey, responses));
      delete correct[premiseKey];
      this.update({ premises, responses, correct: correct });
    },
    addItems() {
      let premises = cloneDeep(this.premises);
      let responses = cloneDeep(this.responses);
      let correct = cloneDeep(this.correct);
      const premiseKey = cuid();
      const responseKey = cuid();
      premises.push({ key: premiseKey, value: '' });
      responses.push({ key: responseKey, value: '' });
      correct[premiseKey] = responseKey;
      this.update({
        premises: shuffle(premises),
        responses: shuffle(responses),
        correct
      });
    },
    focus(key) {
      this.focused.key = this.isFocused(key) ? {} : key;
    },
    isFocused(key) {
      return this.focused.key === key;
    },
    update(data) {
      const { premiseHeading: premise, responseHeading: response } = this;
      data.headings = { premise, response };
      this.$emit('update', data, true);
    },
    hasError(key, type) {
      let index = type === 'premises'
        ? this.premises.indexOf(this.getPremiseItem(key))
        : this.responses.indexOf(this.getResponseItem(key));
      const answer = `${type}[${index}].value`;
      return { 'error': this.errors.includes(answer) };
    }
  }
};
</script>

<style lang="scss" scoped>
.no-gutters {
  margin: 40px 0;

  [class*="col-"] {
    padding-left: 0;
    padding-right: 0;
  }
}

.heading > span, .front, .mdi {
  padding: 14px 5px;
  display: block;
}

.heading {
  .heading-input-wrapper {
    height: 48px;
    border-bottom: 1px dashed grey;

    .heading-input {
      width: 100%;
      height: 100%;
      text-align: center;
      vertical-align: middle;
      box-shadow: none;

      &:focus {
        box-shadow: none;
        outline: none;
      }
    }
  }
}

.premise-container, .response-container {
  transition: 0.5s;
  transform-style: preserve-3d;

  .front, .back {
    backface-visibility: hidden;
  }

  .front {
    transform: rotateX(0deg);
  }

  .back {
    transform: rotateX(180deg);
  }

  &.flip {
     transform: rotateX(180deg);
   }
}

.premise-view {
  background-color: rgb(217, 217, 217);
  border: 1px solid rgb(89, 89, 89);
}

.response-view {
  background-color: rgb(238, 238, 238);
  border: 1px dashed rgb(89, 89, 89);
}

.premise-input, .response-input {
  position: absolute;
  top: 0;
  height: 100%;
}

.mdi-plus {
  font-size: 28px;
  display: inline;
}

.destroy {
  font-size: 15px
}

.mdi-plus:hover, .mdi-close:hover {
  cursor: pointer;
  color: #42b983;
}

.error {
  border-bottom: 0;
  box-shadow: inset 0 -2px 0 #e51c23;
}

.disabled {
  pointer-events: none;
}
</style>
