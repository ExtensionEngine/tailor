<template>
  <div>
    <div class="row no-gutters header">
      <span class="col-xs-offset-1 col-xs-4 center">Premise</span>
      <span class="col-xs-offset-2 col-xs-4 center">Response</span>
    </div>
    <div v-for="(pair, row) in pairs" class="row no-gutters">
      <div
        :class="{ 'flip': isFocused(row, 0) }"
        class="col-xs-offset-1 col-xs-4 flip-container">
        <div @click="focus(row, 0)" class="premise-view front center">
          <span :class="errorClass(row, 0)">
            {{ pair.premise || 'Click to edit' }}
          </span>
        </div>
        <input
          v-model="pair.premise"
          v-focus="{ row, col: 0 }"
          @keyup.enter="focus(row, 0)"
          @keyup.esc="focus(row, 0)"
          @blur="isFocused(row, 0) && focus(row, 0)"
          class="form-control premise-input back"
          placeholder="Insert text here ...">
      </div>
      <div class="col-xs-2 center">
        <span class="mdi mdi-arrow-right"></span>
      </div>
      <div :class="{ 'flip': isFocused(row, 1) }" class="col-xs-4 flip-container">
        <div @click="focus(row, 1)" class="response-view front center">
          <span :class="errorClass(row, 1)">
            {{ pair.response || 'Click to edit' }}
          </span>
        </div>
        <input
          v-model="pair.response"
          v-focus="{ row, col: 1 }"
          @keyup.enter="focus(row, 1)"
          @keyup.esc="focus(row, 1)"
          @blur="isFocused(row, 1) && focus(row, 1)"
          class="form-control response-input back"
          placeholder="Insert text here ...">
      </div>
      <div class="col-xs-1 destroy center">
        <span v-show="isEditing" @click="removePair(row)" class="mdi mdi-close">
        </span>
      </div>
    </div>
    <div v-show="!maxPairsReached && isEditing" class="add-pair">
      <span @click="addPair" class="mdi mdi-plus"></span>
    </div>
    <div class="alert-container">
      <transition name="fade">
        <span v-if="hasPairsError" class="alert alert-danger">
          Please create at least two premise-response pairs !
        </span>
      </transition>
    </div>
  </div>
</template>

<script>
import isEmpty from 'lodash/isEmpty';

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
  computed: {
    hasPairsError() {
      return !isEmpty(this.errors) && this.errors.indexOf('correct') !== -1;
    },
    pairs() {
      return this.assessment.correct;
    },
    maxPairsReached() {
      return this.pairs.length >= 10;
    }
  },
  methods: {
    removePair(row) {
      this.pairs.splice(row, 1);
    },
    addPair() {
      this.pairs.push({ premise: '', response: '' });
    },
    focus(row, col) {
      this.focused = this.isFocused(row, col) ? {} : { row, col };
    },
    isFocused(row, col) {
      return this.focused.col === col && this.focused.row === row;
    },
    update(validate) {
      this.$emit('update', { correct: this.pairs }, validate);
    },
    errorClass(row, col) {
      const answer = `correct[${row}].${col ? 'response' : 'premise'}`;
      return { 'error': this.errors.includes(answer) };
    }
  },
  watch: {
    pairs: {
      handler() {
        this.update(true);
      },
      deep: true
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

.flip-container {
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

.alert {
  display: inline-block;
  padding: 7px 13px;
  margin: 20px 0;
}

.mdi:hover {
  cursor: pointer;
  color: #42b983;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.error {
  box-shadow: inset 0 -2px 0 #e51c23;
  border-bottom: 0;
}
</style>
