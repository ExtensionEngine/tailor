<template>
  <div :class="{ disabled: !isEditing }">
    <div class="row no-gutters heading">
      <div
        :class="{ error: errors.includes('headings.premise') }"
        class="col-xs-4 col-xs-offset-1 heading-input-wrapper">
        <input
          @blur="e => updateHeading({ premise: e.target.value })"
          :value="headings.premise"
          class="heading-input"
          type="text">
      </div>
      <div class="col-xs-2"></div>
      <div
        :class="{ error: errors.includes('headings.response') }"
        class="col-xs-4 heading-input-wrapper">
        <input
          @blur="e => updateHeading({ response: e.target.value })"
          :value="headings.response"
          class="heading-input"
          type="text">
      </div>
    </div>
    <div
      v-for="(responseKey, premiseKey) in correct"
      :key="responseKey"
      class="row no-gutters">
      <div
        :class="{ flip: isFocused(premiseKey) }"
        class="col-xs-4 col-xs-offset-1 premise-container">
        <div @click="focus(premiseKey)" class="premise-view front">
          <span :class="hasError(premiseKey, 'premises')">
            {{ getPremiseContent(premiseKey) || 'Click to edit' }}
          </span>
        </div>
        <input
          v-focus="{ key: premiseKey }"
          @change="updatePremiseContent(premiseKey, $event)"
          @keyup.enter="focus(premiseKey)"
          @keyup.esc="focus(premiseKey)"
          @blur="isFocused(premiseKey) && focus(premiseKey)"
          :value="getPremiseContent(premiseKey)"
          class="form-control premise-input back"
          placeholder="Insert text here ...">
      </div>
      <div class="col-xs-2">
        <span class="mdi mdi-arrow-right"></span>
      </div>
      <div
        :class="{ flip: isFocused(responseKey) }"
        class="col-xs-4 response-container">
        <div @click="focus(responseKey)" class="response-view front">
          <span :class="hasError(responseKey, 'responses')">
            {{ getResponseContent(responseKey) || 'Click to edit' }}
          </span>
        </div>
        <input
          v-focus="{ key: responseKey }"
          @change="updateResponseContent(responseKey, $event)"
          @keyup.enter="focus(responseKey)"
          @keyup.esc="focus(responseKey)"
          @blur="isFocused(responseKey) && focus(responseKey)"
          :value="getResponseContent(responseKey)"
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
import { defaults } from 'utils/assessment';
import find from 'lodash/find';
import keys from 'lodash/keys';
import pull from 'lodash/pull';
import shuffle from 'lodash/shuffle';

export default {
  props: {
    assessment: { type: Object, default: defaults.MQ },
    errors: { type: Array, default: () => ([]) },
    isEditing: { type: Boolean, default: false }
  },
  data() {
    return {
      focused: { key: null }
    };
  },
  computed: {
    headings() {
      return { premise: null, response: null, ...this.assessment.headings };
    },
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
    updateHeading(val) {
      this.update({ headings: { ...this.headings, ...val } });
    },
    updatePremiseContent(key, evt) {
      const premises = cloneDeep(this.premises);
      this.getPremiseItem(key, premises).value = evt.target.value;
      this.update({ premises: shuffle(premises) });
    },
    updateResponseContent(key, evt) {
      const responses = cloneDeep(this.responses);
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
      return find(premises, { key });
    },
    getResponseItem(key, responses = this.responses) {
      return find(responses, { key });
    },
    removeItems(premiseKey, responseKey) {
      const premises = cloneDeep(this.premises);
      const responses = cloneDeep(this.responses);
      const correct = cloneDeep(this.correct);
      pull(premises, this.getPremiseItem(premiseKey, premises));
      pull(responses, this.getResponseItem(responseKey, responses));
      delete correct[premiseKey];
      this.update({ premises, responses, correct });
    },
    addItems() {
      const premises = cloneDeep(this.premises);
      const responses = cloneDeep(this.responses);
      const correct = cloneDeep(this.correct);
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
    update(data = {}) {
      this.$emit('update', data, true);
    },
    hasError(key, type) {
      const index = type === 'premises'
        ? this.premises.indexOf(this.getPremiseItem(key))
        : this.responses.indexOf(this.getResponseItem(key));
      const answer = `${type}[${index}].value`;
      return { error: this.errors.includes(answer) };
    }
  },
  directives: {
    focus: {
      update(el, binding, vnode) {
        const focusedKey = vnode.context.focused.key;
        const key = binding.value.key;
        if (key === focusedKey) {
          el.focus();
        } else {
          el.blur();
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.no-gutters {
  margin: 40px 0;

  [class*="col-"] {
    padding-right: 0;
    padding-left: 0;
  }
}

.heading > span, .front, .mdi {
  display: block;
  padding: 14px 5px;
}

.heading {
  .heading-input-wrapper {
    height: 48px;
    border-bottom: 1px dashed grey;

    &.error {
      border-bottom: 2px solid #e51c23;
    }

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
  display: inline;
  font-size: 28px;
}

.destroy {
  font-size: 15px;
}

.mdi-plus:hover, .mdi-close:hover {
  color: #42b983;
  cursor: pointer;
}

.error {
  border-bottom: 0;
  box-shadow: inset 0 -2px 0 #e51c23;
}

.disabled {
  pointer-events: none;
}
</style>
