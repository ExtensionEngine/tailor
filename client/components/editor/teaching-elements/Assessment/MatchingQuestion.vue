<template>
  <div :class="{ 'disabled': !isEditing }">
    <div class="row no-gutters header">
      <span class="col-xs-offset-1 col-xs-4 center">Premise</span>
      <span class="col-xs-offset-2 col-xs-4 center">Response</span>
    </div>
    <div v-for="(pair, row) in pairs" class="row no-gutters">
      <div
        :class="{ 'flip': isFocused(row) }"
        class="col-xs-offset-1 col-xs-4 premise-container">
        <div @click="focus(row)" class="premise-view front center">
          <span :class="errorClass(row)">
            {{ pair.premise || 'Click to edit' }}
          </span>
        </div>
        <input
          v-model="pair.premise"
          v-focus="{ row }"
          @change="update()"
          @keyup.enter="focus(row)"
          @keyup.esc="focus(row)"
          @blur="isFocused(row) && focus(row)"
          class="form-control premise-input back"
          placeholder="Insert text here ...">
      </div>
      <div class="col-xs-2 center">
        <span class="mdi mdi-arrow-right"></span>
      </div>
      <div :class="{ 'flip': isFocused(row, 1) }" class="col-xs-4 response-container">
        <div @click="focus(row, 1)" class="response-view front center">
          <span :class="errorClass(row, 1)">
            {{ pair.response || 'Click to edit' }}
          </span>
        </div>
        <input
          v-model="pair.response"
          v-focus="{ row, col: 1 }"
          @change="update()"
          @keyup.enter="focus(row, 1)"
          @keyup.esc="focus(row, 1)"
          @blur="isFocused(row, 1) && focus(row, 1)"
          class="form-control response-input back"
          placeholder="Insert text here ...">
      </div>
      <div class="col-xs-1 destroy center">
        <span
          v-show="!minPairsReached && isEditing"
          @click="removePair(row)"
          class="mdi mdi-close">
        </span>
      </div>
    </div>
    <div v-show="!maxPairsReached && isEditing" class="add-pair">
      <span @click="addPair" class="mdi mdi-plus"></span>
    </div>
  </div>
</template>

<script>
import isEmpty from 'lodash/isEmpty';
import times from 'lodash/times';

export default {
  directives: {
    focus: {
      update(el, binding, vnode) {
        const col = vnode.context.focused.col;
        const row = vnode.context.focused.row;
        const newCol = binding.value.col;
        const newRow = binding.value.row;
        col === newCol && row === newRow ? el.focus() : el.blur();
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
      focused: { row: null, col: null }
    };
  },
  created() {
    if (this.pairs.length < 2) {
      times(2, () => this.pairs.push({ premise: '', response: '' }));
      this.update();
    }
  },
  computed: {
    hasPairsError() {
      return !isEmpty(this.errors) && this.errors.indexOf('correct') !== -1;
    },
    pairs() {
      return this.assessment.correct;
    },
    maxPairsReached() {
      return this.pairs.length >= 10;
    },
    minPairsReached() {
      return this.pairs.length <= 2;
    }
  },
  methods: {
    removePair(row) {
      this.pairs.splice(row, 1);
      this.update();
    },
    addPair() {
      this.pairs.push({ premise: '', response: '' });
      this.update();
    },
    focus(row, col) {
      this.focused = this.isFocused(row, col) ? {} : { row, col };
    },
    isFocused(row, col) {
      return this.focused.col === col && this.focused.row === row;
    },
    update() {
      this.$emit('update', { correct: this.pairs }, true);
    },
    errorClass(row, col) {
      const answer = `correct[${row}].${col ? 'response' : 'premise'}`;
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

.center {
  padding: 14px 5px;
}

.header span {
  border-bottom: 1px dashed grey;
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
}

.destroy {
  padding: 9.5px 5px;
  font-size: 20px
}

.mdi:hover {
  cursor: pointer;
  color: #42b983;
}
</style>
