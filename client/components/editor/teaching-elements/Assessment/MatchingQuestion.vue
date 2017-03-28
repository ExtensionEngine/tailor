<template>
  <div :class="{ 'disabled': disabled }">
    <div class="row heading">
      <div class="col-xs-5">Premise</div>
      <div class="col-xs-offset-2 col-xs-5">Response</div>
    </div>
    <div v-for="(it, row) in getMatch" class="row">
      <div :class="{ 'flip': isSelected(row, 0) }" class="box-flip col-xs-5">
        <div @click="flip(row, 0)" class="premise-view">
          <span :class="errorClass(row, 0)">{{ it.premise || 'Click to edit' }}</span>
        </div>
        <input
          v-model="it.premise"
          v-focus="{ row, col: 0 }"
          @keyup.enter="flip(row, 0)"
          @keyup.esc="flip(row, 0)"
          @blur="isSelected(row, 0) && flip(row, 0)"
          class="form-control premise-input"
          placeholder="Insert text here ...">
      </div>
      <div class="col-xs-2 relation">
        <span @click="removeMatch(row)" class="fa fa-times destroy"></span>
        <span class="fa fa-long-arrow-right"></span>
      </div>
      <div :class="{ 'flip': isSelected(row, 1) }" class="box-flip col-xs-5">
        <div @click="flip(row, 1)" class="response-view">
          <span :class="errorClass(row, 1)">{{ it.response || 'Click to edit' }}</span>
        </div>
        <input
          v-model="it.response"
          v-focus="{ row, col: 1 }"
          @keyup.enter="flip(row, 1)"
          @keyup.esc="flip(row, 1)"
          @blur="isSelected(row, 1) && flip(row, 1)"
          class="form-control response-input"
          placeholder="Insert text here ...">
      </div>
    </div>
    <div v-show="isAllowed" class="add-match">
      <span @click="addMatch()" class="mdi mdi-plus"></span>
    </div>
    <div class="alert-container">
      <transition name="fade">
        <span v-if="hasMatchError" class="alert alert-danger">
          Please create at least two premise-response pairs !
        </span>
      </transition>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';

export default {
  directives: {
    focus: {
      update(el, binding, vnode) {
        const col = vnode.context.flipped.col;
        const row = vnode.context.flipped.row;
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
      flipped: { row: null, col: null },
      localErrors: cloneDeep(this.errors)
    };
  },
  computed: {
    hasMatchError() {
      const errors = this.localErrors;
      return !isEmpty(errors) && errors.indexOf('correct') !== -1;
    },
    question() {
      return this.assessment.question;
    },
    getMatch() {
      return this.assessment.correct;
    },
    disabled() {
      return !this.isEditing;
    },
    isAllowed() {
      return this.getMatch.length < 10;
    }
  },
  methods: {
    removeMatch(row) {
      this.getMatch.splice(row, 1);
      this.update();
    },
    addMatch() {
      if (this.getMatch.length === 10) return;
      this.getMatch.push({ premise: '', response: '' });
      this.update();
    },
    flip(row, col) {
      if (this.isSelected(row, col)) {
        this.flipped = { row: null, col: null };
      } else {
        this.flipped = { row, col };
      }
    },
    isSelected(row, col) {
      return this.flipped.col === col && this.flipped.row === row;
    },
    update(message) {
      this.$emit('update', { correct: this.getMatch });
    },
    syncErrors() {
      if (!isEmpty(this.localErrors)) this.$emit('syncErrors');
    },
    errorClass(row, col) {
      const answer = `correct[${row}].${col === 0 ? 'premise' : 'response'}`;
      return { 'error': this.localErrors.includes(answer) };
    }
  },
  watch: {
    errors() {
      this.localErrors = this.errors;
    },
    getMatch: {
      handler() {
        this.update();
        this.syncErrors();
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
.row {
  margin: 0 auto 40px auto;
  min-height: 50px;
  font-size: 18px;
  width: 90%;

  [class*="col-"] {
    min-height: 50px;
  }
}

.heading {
  margin-top: 50px;

  div {
    border-bottom: 1px dashed grey;
  }
}

.box-flip.flip {
   transform: rotateX(180deg);
 }

.error {
  box-shadow: inset 0 -2px 0 #e51c23;
  border-bottom: 0;
}

.alert-container {
  min-height: 40px;
  margin-top: 20px;

  .alert {
    display: inline-block;
    padding: 7px 13px;
    font-size: 15px;
    margin: 0;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.disabled {
  pointer-events: none;
}

.add-match {
  text-align: center;
  margin-top: 40px;
  min-height: 50px;
  font-size: 28px;

  .mdi:hover {
    cursor: pointer;
    color: #42b983;
  }
}

.relation {
  display: table;

  .destroy {
    background-color: transparent;
    transform-style: preserve-3d;
    transition: 0.5s;
    display: none;
    opacity: 0.5;
    border: 0;
  }

  .fa-long-arrow-right {
    vertical-align: middle;
    display: table-cell;
    font-size: 28px;
    color: #707070;
  }
}

.relation:hover {
  .destroy {
    vertical-align: middle;
    display: table-cell;

    &:hover {
      cursor: pointer;
      color: #555;
    }
  }

  .fa-long-arrow-right {
    display: none;
  }
}

.box-flip {
  transform-style: preserve-3d;
  transition: 0.5s;
  min-height: 50px;
}

.premise-view,
.response-view {
  backface-visibility: hidden;
  text-overflow: ellipsis;
  transform: rotateX(0deg);
  text-align: center;
  padding: 12px 13px;
  position: absolute;
  white-space: nowrap;
  min-height: 50px;
  overflow: hidden;
  width: 100%;
  left: 0;
  top: 0;
}

.premise-view {
  background-color: rgb(217, 217, 217);
  border: 1px solid rgb(89, 89, 89);
}

.response-view {
  background-color: rgb(238, 238, 238);
  border: 1px dashed rgb(89, 89, 89);
}

.premise-input,
.response-input {
  backface-visibility: hidden;
  transform: rotateX(180deg);
  position: absolute;
  min-height: 50px;
  left: 0;
  top: 0;
}
</style>
