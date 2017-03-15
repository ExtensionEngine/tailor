<template>
  <div :class="{ 'disabled': disabled }">
    <div class="row">
      <div
        v-for="(dropSpot, col) in dropSpots"
        :class="lgCol"
        class="drop-spots col-md-6 col-sm-12">
        <div :class="{'flip': flip(col)}" class="heading-box flipper">
          <div @click="toggleDisplay(col)" class="heading-view">
            <span :class="errorClass(col)" class="heading-text">
              {{ dropSpot.heading }}
            </span>
            <span
              v-show="allowRemove(col)"
              @click.stop="removeDropSpot(col)"
              class="fa fa-times destroy">
            </span>
          </div>
          <input
            v-model="dropSpot.heading"
            v-focus="{ col, row: null }"
            @keyup.enter="allowToggle(col) && toggleDisplay(col)"
            @keyup.esc="allowToggle(col) && toggleDisplay(col)"
            @blur="allowToggle(col) && toggleDisplay(col)"
            class="form-control heading-input"
            type="text">
        </div>
        <ul>
          <li
            v-for="(answer, row) in answerGroup(col)"
            :class="{'flip': flip(col, row)}"
            class="response-box flipper">
            <div @click="toggleDisplay(col, row)" class="response-view">
              <span :class="errorClass(col, row)" class="response-text">
                {{ answer }}
              </span>
              <span
                v-show="allowRemove(col, row)"
                @click.stop="removeAnswer(col, row)"
                class="fa fa-times destroy">
              </span>
            </div>
            <input
              v-model="answerGroup(col)[row]"
              v-focus="{ col, row }"
              @keyup.esc="allowToggle(col, row) && toggleDisplay(col, row)"
              @keyup.enter="allowToggle(col, row) && toggleDisplay(col, row)"
              @blur="allowToggle(col, row) && toggleDisplay(col, row)"
              class="form-control response-input"
              type="text">
          </li>
          <span
            @click="addAnswer(col)"
            class="fa fa-plus btn btn-link pull-center add-answer">
          </span>
        </ul>
      </div>
    </div>
    <div class="add-spot">
      <span @click="addDropSpot()" class="fa fa-plus btn btn-link"></span>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import times from 'lodash/times';

const defaultAnswer = 'Response item..';
const defaultHead = 'Drop spot..';

export default {
  props: {
    assessment: Object,
    errors: Array,
    isEditing: Boolean
  },
  data() {
    return {
      flipped: { col: null, row: null },
      localErrors: cloneDeep(this.errors)
    };
  },
  created() {
    if (this.dropSpots.length < 2) {
      times(2, () => this.dropSpots.push({
        heading: defaultHead,
        answers: [defaultAnswer]
      }));
    }
  },
  computed: {
    dropSpots() {
      return this.assessment.correct;
    },
    disabled() {
      return !this.isEditing;
    },
    lgCol() {
      return this.dropSpots.length === 2 ? 'col-lg-6' : 'col-lg-4';
    }
  },
  methods: {
    update(message) {
      this.$emit('update', { correct: this.dropSpots });
    },
    answerGroup(col) {
      return this.dropSpots[col].answers;
    },
    addAnswer(col) {
      this.answerGroup(col).push(defaultAnswer);
      this.update();
    },
    addDropSpot() {
      this.dropSpots.push({
        heading: defaultHead,
        answers: [defaultAnswer] });
      this.update();
    },
    removeAnswer(col, row) {
      this.answerGroup(col).splice(row, 1);
      this.removeSingleError(col, row);
      this.update();
    },
    removeDropSpot(col) {
      this.dropSpots.splice(col, 1);
      this.removeSetError(col);
      this.update();
    },
    allowRemove(col, row) {
      return row !== undefined
        ? this.dropSpots[col].answers.length > 1
        : this.dropSpots.length > 2;
    },
    allowToggle(col, row = null) {
      const flipped = this.flipped;
      if (row === null) return flipped.col === col && flipped.row === null;
      return flipped.col === col && flipped.row === row;
    },
    toggleDisplay(col, row) {
      if (this.flipped.col === col &&
         (this.flipped.row === row || this.flipped.row === null)) {
        this.flipped = { col: null, row: null };
        return;
      }
      this.flipped = row !== undefined ? { col, row } : { col, row: null };
    },
    flip(col, row) {
      const flipped = this.flipped;
      if (row !== undefined) return flipped.col === col && flipped.row === row;
      return flipped.col === col && flipped.row === null;
    },
    errorClass(col, row) {
      let answer = `correct[${col}].answers[${row}]`;
      if (row === undefined) answer = `correct[${col}].heading`;
      return { 'error': this.localErrors.includes(answer) };
    },
    removeSingleError(col, row) {
      let tempArr = this.localErrors;
      const message = `correct[${col}].answers[${row}]`;
      if (tempArr.indexOf(message) !== -1) tempArr.splice(tempArr.indexOf(message), 1);
      tempArr.forEach((it, index) => {
        if (it.includes(`correct[${col}].answers`)) {
          let num = Number(it.substring(it.lastIndexOf('[') + 1, it.length - 1));
          if (num > row) tempArr[index] = `correct[${col}].answers[${num - 1}]`;
        }
      });
    },
    removeSetError(col) {
      const message = `correct[${col}]`;
      this.localErrors = this.localErrors.filter(it => it.includes(message) === false);
      this.localErrors.forEach((it, index) => {
        if (it.includes('correct')) {
          let num = Number(it.substring(it.indexOf('[') + 1, it.indexOf(']')));
          if (num > col) {
            let firstPart = it.substring(0, it.indexOf('[') + 1);
            let changedPart = `${num - 1}`;
            let lastPart = it.substring(it.indexOf(']'), it.length);
            this.localErrors[index] = firstPart + changedPart + lastPart;
          }
        }
      });
    }
  },
  watch: {
    errors() {
      this.localErrors = this.errors;
    }
  },
  directives: {
    focus: {
      update(el, binding, vnode) {
        const flipCol = vnode.context.flipped.col;
        const flipRow = vnode.context.flipped.row;
        const col = binding.value.col;
        const row = binding.value.row;
        if (flipCol === col && flipRow === row) el.focus();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.flipper{
  transition: 0.5s;
	transform-style: preserve-3d;
}

.flipper.flip{
  transform: rotateX(180deg);
}

.error {
  border-bottom: 0;
  box-shadow: inset 0 -2px 0 #e51c23;
}

.disabled {
  pointer-events:none;
}

.row {
  display: inline-block;
  width: 70%;
  padding-top: 63px;
}

ul {
  list-style: none;
  padding: 0;

  li {
    margin: 13px 0;
    width: 100%;
  }
}

.add-answer {
  margin: 0 0 25px 0;
}

.add-spot {
  display: inline-block;
  font-size: 22px;
  float: right;
  width: 30%;
  margin-top: 141px;
}

.heading-view,
.response-view {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: absolute;
  width: 100%;
  backface-visibility: hidden;
  transform: rotateX(0deg);
}

.destroy {
  position: absolute;
  right: 11px;
  visibility: hidden;
  opacity: 0.5;
  border: 0;
  background-color: transparent;
}

.heading-box {
  min-height: 52px;
  position: relative;

  .heading-view {
    height: 100%;
    background-color: rgb(238, 238, 238);
    padding: 14px 30px;
    border: 1px solid rgb(89, 89, 89);

    .destroy {
      top: 16px;
    }
  }
}

.response-box {
  min-height: 46px;
  position: relative;

  .response-view {
    background-color: rgb(217, 217, 217);
    border: 1px dashed rgb(89, 89, 89);
    padding: 11px 30px;

    .destroy {
      top: 12px;
    }
  }
}

.response-input,
.heading-input {
  min-height: inherit;
  position: absolute;
  backface-visibility: hidden;
  transform: rotateX( 180deg );
}

.response-box:hover,
.heading-box:hover {
  .destroy {
    visibility: visible;
  }
}
</style>
