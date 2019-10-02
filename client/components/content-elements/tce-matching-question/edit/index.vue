<template>
  <v-container :class="{ disabled: !isEditing }">
    <v-row justify="center" no-gutters class="heading">
      <v-col
        :class="{ error: errors.includes('headings.premise') }"
        cols="4" offset="1" class="heading-input-wrapper">
        <v-text-field
          @change="value => updateHeading({ premise: value })"
          :value="headings.premise"
          :disabled="!isEditing"
          class="heading-input" />
      </v-col>
      <v-col class="col-2" />
      <v-col
        :class="{ error: errors.includes('headings.response') }"
        cols="4"
        class="heading-input-wrapper">
        <v-text-field
          @change="value => updateHeading({ response: value })"
          :value="headings.response"
          :disabled="!isEditing"
          class="heading-input" />
      </v-col>
      <v-col cols="1" />
    </v-row>
    <v-row
      v-for="(responseKey, premiseKey) in correct"
      :key="responseKey"
      justify="center"
      no-gutters>
      <v-col
        :class="{ flip: isFocused(premiseKey) }"
        cols="4"
        offset="1"
        class="premise-container">
        <div @click="focus(premiseKey)" class="premise-view front">
          <span :class="hasError(premiseKey, 'premises')">
            {{ getPremiseContent(premiseKey) || 'Click to edit' }}
          </span>
        </div>
        <v-text-field
          v-focus="{ key: premiseKey }"
          @change="updatePremiseContent(premiseKey, $event)"
          @keyup.enter="focus(premiseKey)"
          @keyup.esc="focus(premiseKey)"
          @blur="isFocused(premiseKey) && focus(premiseKey)"
          :value="getPremiseContent(premiseKey)"
          class="premise-input back"
          placeholder="Insert text here ..." />
      </v-col>
      <v-col cols="2" align-self="center">
        <v-icon small>mdi-arrow-right</v-icon>
      </v-col>
      <v-col
        :class="{ flip: isFocused(responseKey) }"
        cols="4"
        class="response-container">
        <div @click="focus(responseKey)" class="response-view front">
          <span :class="hasError(responseKey, 'responses')">
            {{ getResponseContent(responseKey) || 'Click to edit' }}
          </span>
        </div>
        <v-text-field
          v-focus="{ key: responseKey }"
          @change="updateResponseContent(responseKey, $event)"
          @keyup.enter="focus(responseKey)"
          @keyup.esc="focus(responseKey)"
          @blur="isFocused(responseKey) && focus(responseKey)"
          :value="getResponseContent(responseKey)"
          class="premise-input back"
          placeholder="Insert text here ..." />
      </v-col>
      <v-col cols="1" align-self="center">
        <v-btn
          v-show="!minItems && isEditing"
          @click="removeItems(premiseKey, responseKey)"
          small
          icon>
          <v-icon small>mdi-close</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-btn v-show="!maxItems && isEditing" @click="addItems" icon>
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </v-container>
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
    updatePremiseContent(key, value) {
      let premises = cloneDeep(this.premises);
      this.getPremiseItem(key, premises).value = value;
      this.update({ premises: shuffle(premises) });
    },
    updateResponseContent(key, value) {
      let responses = cloneDeep(this.responses);
      this.getResponseItem(key, responses).value = value;
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
      let premises = cloneDeep(this.premises);
      let responses = cloneDeep(this.responses);
      let correct = cloneDeep(this.correct);
      pull(premises, this.getPremiseItem(premiseKey, premises));
      pull(responses, this.getResponseItem(responseKey, responses));
      delete correct[premiseKey];
      this.update({ premises, responses, correct });
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
    update(data = {}) {
      this.$emit('update', data, true);
    },
    hasError(key, type) {
      let index = type === 'premises'
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
          vnode.componentInstance.focus();
        } else {
          vnode.componentInstance.blur();
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.no-gutters {
  margin-bottom: 40px;
}

.heading > span, .front {
  display: block;
  padding: 14px 5px;
}

.heading {
  .heading-input-wrapper {
    height: 48px;

    &.error {
      border-bottom: 2px solid #e51c23;
    }

    ::v-deep input {
      text-align: center;
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
  width: 100%;
  height: 100%;
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
