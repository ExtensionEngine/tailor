<template>
  <div :class="{ 'disabled': !isEditing }">
    <div class="row no-gutters heading">
      <div class="col-xs-offset-1 col-xs-4 heading-input-wrapper">
        <input
          v-model="premiseHeading"
          @blur="update"
          class="heading-input"
          type="text"/>
      </div>
      <div class="col-xs-2"></div>
      <div class="col-xs-4 heading-input-wrapper">
        <input
          v-model="responseHeading"
          @blur="update"
          class="col-xs-4 heading-input"
          type="text"/>
      </div>
    </div>
    <div v-for="(responseKey, premiseKey) in pairs" class="row no-gutters">
      <div
        :class="{ 'flip': isFocused(premiseKey) }"
        class="col-xs-offset-1 col-xs-4 premise-container">
        <div @click="focus(premiseKey)" class="premise-view front">
          <span :class="errorClass(premiseKey)">
            {{ premises[premiseKey] || 'Click to edit' }}
          </span>
        </div>
        <input
          v-model="premises[premiseKey]"
          v-focus="{ newKey: premiseKey }"
          @change="update(premiseKey, responseKey[0])"
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
        :class="{ 'flip': isFocused(responseKey[0]) }"
        class="col-xs-4 response-container">
        <div @click="focus(responseKey[0])" class="response-view front">
          <span :class="errorClass(responses[responseKey[0]])">
            {{ responses[responseKey[0]] || 'Click to edit' }}
          </span>
        </div>
        <input
          v-model="responses[responseKey[0]]"
          v-focus="{ newKey: responseKey[0] }"
          @change="update(premiseKey, responseKey[0])"
          @keyup.enter="focus(responseKey[0])"
          @keyup.esc="focus(responseKey[0])"
          @blur="isFocused(responseKey[0]) && focus(responseKey[0])"
          class="form-control response-input back"
          placeholder="Insert text here ...">
      </div>
      <div class="col-xs-1 destroy">
        <span
          v-show="!minPairs && isEditing"
          @click="removePair(responseKey[0])"
          class="mdi mdi-close">
        </span>
      </div>
    </div>
    <div v-show="!maxPairs && isEditing" class="add-pair">
      <span @click="addPair" class="mdi mdi-plus"></span>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import cuid from 'cuid';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
import keys from 'lodash/keys';

export default {
  directives: {
    focus: {
      update(el, binding, vnode) {
        if (vnode.context.focused.key === binding.value.newKey) {
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
    hasPairsError() {
      return !isEmpty(this.errors) && this.errors.indexOf('correct') !== -1;
    },
    premises() {
      return cloneDeep(this.assessment.premises) || {};
    },
    responses() {
      return cloneDeep(this.assessment.responses) || {};
    },
    pairs() {
      return cloneDeep(this.assessment.correct) || {};
    },
    maxPairs() {
      return keys(this.pairs).length >= 10;
    },
    minPairs() {
      return keys(this.pairs).length <= 2;
    }
  },
  methods: {
    removePair(premiseKey) {
      const responseKey = this.pairs[premiseKey];
      delete this.pairs[premiseKey];
      this.update(premiseKey, responseKey);
    },
    addPair() {
      const premise = cuid();
      const response = cuid();
      this.premises[premise] = '';
      this.responses[response] = '';
      this.pairs[premise] = [response];
      // this.update();
    },
    focus(key) {
      this.focused.key = this.isFocused(key) ? null : key;
    },
    isFocused(key) {
      return this.focused.key === key;
    },
    update(premise, response) {
      const { premiseHeading: premiseTitle, responseHeading: responseTitle } = this;
      this.$emit('update', {
        correct: this.pairs,
        headings: { premiseTitle, responseTitle },
        premises: this.premises,
        responses: this.responses
      }, true);
    },
    errorClass(key) {
      // const answer = `correct[${row}].${col ? 'response' : 'premise'}`;
      // return { 'error': this.errors.includes(answer) };
    }
  },
  watch: {
    premiseHeading: debounce(function () {
      this.update();
    }, 2000),
    responseHeading: debounce(function () {
      this.update();
    }, 2000)
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
