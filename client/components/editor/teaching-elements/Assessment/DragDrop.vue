<template>
  <div :class="{ 'disabled': !isEditing }">
    <div class="row">
      <div v-for="(dropSpot, col) in dropSpots" :class="colWidth" class="col-md-6">
        <div :class="{ 'flip': isFocused(col) }" class="drop-container">
          <div @click="focus(col)" class="heading-view front center">
            <span :class="errorClass(col)">
              {{ dropSpot.heading || 'Click to edit' }}
            </span>
            <span
              v-show="!minDropsReached(col) && isEditing"
              @click.stop="removeDropSpot(col)"
              class="destroy mdi mdi-close">
            </span>
          </div>
          <input
            v-model="dropSpot.heading"
            v-focus="{ col }"
            @change="update()"
            @keyup.enter="focus(col)"
            @keyup.esc="focus(col)"
            @blur="isFocused(col) && focus(col)"
            class="form-control heading-input back"
            placeholder="Insert text here ...">
        </div>
        <ul>
          <li
            v-for="(answer, row) in answerGroup(col)"
            :class="{ 'flip': isFocused(col, row) }"
            class="answer-container">
            <div @click="focus(col, row)" class="response-view front center">
              <span :class="errorClass(col, row)">
                {{ answer || 'Click to edit' }}
              </span>
              <span
                v-show="!minAnswersReached(col, row) && isEditing"
                @click.stop="removeAnswer(col, row)"
                class="destroy mdi mdi-close">
              </span>
            </div>
            <input
              v-model="answerGroup(col)[row]"
              v-focus="{ col, row }"
              @change="update()"
              @keyup.esc="focus(col, row)"
              @keyup.enter="focus(col, row)"
              @blur="isFocused(col, row) && focus(col, row)"
              class="form-control response-input back"
              placeholder="Insert text here ...">
          </li>
          <span
            v-show="isEditing" @click="addAnswer(col)" class="add-answer mdi mdi-plus">
          </span>
        </ul>
      </div>
    </div>
    <div class="add-dropSpot">
      <span v-show="isEditing" @click="addDropSpot()" class="mdi mdi-plus"></span>
    </div>
  </div>
</template>

<script>
import isNumber from 'lodash/isNumber';
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
      focused: { col: null, row: null }
    };
  },
  created() {
    if (this.dropSpots.length < 2) {
      times(2, () => this.dropSpots.push({ heading: '', answers: [''] }));
      this.update();
    }
  },
  computed: {
    dropSpots() {
      return this.assessment.correct;
    },
    colWidth() {
      return this.dropSpots.length === 2 ? 'col-lg-6' : 'col-lg-4';
    }
  },
  methods: {
    addAnswer(col) {
      this.answerGroup(col).push('');
      this.update();
    },
    addDropSpot() {
      this.dropSpots.push({ heading: '', answers: [''] });
      this.update();
    },
    minDropsReached(col) {
      return this.dropSpots.length <= 2;
    },
    minAnswersReached(col, row) {
      return this.dropSpots[col].answers.length <= 1;
    },
    answerGroup(col) {
      return this.dropSpots[col].answers;
    },
    errorClass(col, row) {
      const general = `correct[${col}].`;
      const mutable = `${isNumber(row) ? `answers[${row}]` : 'heading'}`;
      return { 'error': this.errors.includes(general + mutable) };
    },
    focus(col, row) {
      this.focused = this.isFocused(col, row) ? {} : { col, row };
    },
    isFocused(col, row) {
      return this.focused.col === col && this.focused.row === row;
    },
    removeAnswer(col, row) {
      this.answerGroup(col).splice(row, 1);
      this.update();
    },
    removeDropSpot(col) {
      this.dropSpots.splice(col, 1);
      this.update();
    },
    update() {
      this.$emit('update', { correct: this.dropSpots }, true);
    }
  }
};
</script>

<style lang="scss" scoped>
.row {
  display: inline-block;
  width: 80%;
  margin-top: 63px;
}

.add-dropSpot {
  font-size: 28px;
  float: right;
  width: 20%;
  margin-top: 133px;
}

.center {
  padding: 14px 21px 14px 21px;
}

.mdi:hover {
  cursor: pointer;
  color: #42b983;
}

.add-answer {
  font-size: 20px;
}

.destroy {
  position: absolute;
  top: 14px;
  right: 6px;
}

.drop-container, .answer-container {
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

.heading-view {
  background-color: rgb(217, 217, 217);
  border: 1px solid rgb(89, 89, 89);
}

.response-view {
  background-color: rgb(238, 238, 238);
  border: 1px dashed rgb(89, 89, 89);
}

.heading-input, .response-input {
  position: absolute;
  top: 0;
  height: 100%;
}

ul {
  padding: 0;
  margin: 15px 0;
  list-style: none;

  li {
    margin: 10px 0;
  }
}
</style>
