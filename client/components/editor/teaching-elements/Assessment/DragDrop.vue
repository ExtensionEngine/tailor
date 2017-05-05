<template>
  <div :class="{ 'disabled': !isEditing }">
    <div class="row">
      <div
        v-for="(dropSpot, col) in dropSpots"
        :class="{ 'clear': col % 2 === 0 }"
        class="col-md-6">
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
            @change="update"
            @keyup.enter.esc="focus(col)"
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
              @change="update"
              @keyup.enter.esc="focus(col, row)"
              @blur="isFocused(col, row) && focus(col, row)"
              class="form-control response-input back"
              placeholder="Insert text here ...">
          </li>
        </ul>
        <span @click="addAnswer(col)" class="add-answer mdi mdi-plus"></span>
      </div>
    </div>
    <button @click="addDropSpot" class="btn btn-primary add-dropspot">
      <span class="mdi mdi-plus"></span> Add Group
    </button>
  </div>
</template>

<script>
import isNumber from 'lodash/isNumber';
import times from 'lodash/times';

export default {
  props: {
    assessment: Object,
    isEditing: Boolean,
    errors: Array
  },
  data() {
    return {
      focused: { col: null, row: null }
    };
  },
  computed: {
    dropSpots() {
      return this.assessment.correct;
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
  },
  directives: {
    focus: {
      update(el, binding, vnode) {
        const { col, row } = vnode.context.focused;
        const { col: newCol, row: newRow } = binding.value;
        col === newCol && row === newRow ? el.focus() : el.blur();
      }
    }
  },
  created() {
    if (this.dropSpots.length < 2) {
      times(2, () => this.dropSpots.push({ heading: '', answers: [''] }));
      this.update();
    }
  }
};
</script>

<style lang="scss" scoped>
.add-dropspot {
  padding: 5px 20px;
  margin-top: 80px;
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

.error {
  border-bottom: 0;
  box-shadow: inset 0 -2px 0 #e51c23;
}

.disabled {
  pointer-events: none;

  .add-answer, .add-dropspot {
    visibility: hidden;
  }
}

.clear  {
  clear: left;
  margin-bottom: 80px;
}
</style>
