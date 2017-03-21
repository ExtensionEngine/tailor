<template>
  <div :class="{ 'disabled': disabled }">
    <div class="row">
      <div v-for="(dropSpot, col) in dropSpots" :class="lgCol" class="col-md-6">
        <div :class="{ 'flip': isSelected(col) }" class="heading-box">
          <div @click="flip(col)" class="heading-view">
            <span :class="errorClass(col)">{{ dropSpot.heading }}</span>
            <span
              v-show="allowRemove(col)"
              @click.stop="removeDropSpot(col)"
              class="fa fa-times destroy">
            </span>
          </div>
          <input
            v-model="dropSpot.heading"
            v-focus="{ col, row: null }"
            @keyup.enter="flip(col)"
            @keyup.esc="flip(col)"
            @blur="isSelected(col) && flip(col)"
            class="form-control heading-input">
        </div>
        <ul>
          <li
            v-for="(answer, row) in answerGroup(col)"
            :class="{ 'flip': isSelected(col, row) }"
            class="response-box">
            <div @click="flip(col, row)" class="response-view">
              <span :class="errorClass(col, row)">{{ answer }}</span>
              <span
                v-show="allowRemove(col, row)"
                @click.stop="removeAnswer(col, row)"
                class="fa fa-times destroy">
              </span>
            </div>
            <input
              v-model="answerGroup(col)[row]"
              v-focus="{ col, row }"
              @keyup.esc="flip(col, row)"
              @keyup.enter="flip(col, row)"
              @blur="isSelected(col, row) && flip(col, row)"
              class="form-control response-input">
          </li>
          <span
            @click="addAnswer(col)" class="fa fa-plus btn btn-link add-answer">
          </span>
        </ul>
      </div>
    </div>
    <div class="add-dropSpot">
      <span @click="addDropSpot()" class="fa fa-plus btn btn-link"></span>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import times from 'lodash/times';

const defaultAnswer = 'Response item..';
const defaultHead = 'Drop spot..';

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
    disabled() {
      return !this.isEditing;
    },
    dropSpots() {
      return this.assessment.correct;
    },
    lgCol() {
      return this.dropSpots.length === 2 ? 'col-lg-6' : 'col-lg-4';
    }
  },
  methods: {
    addAnswer(col) {
      this.answerGroup(col).push(defaultAnswer);
    },
    addDropSpot() {
      this.dropSpots.push({ heading: defaultHead, answers: [defaultAnswer] });
    },
    allowRemove(col, row) {
      const dropSpotsLen = this.dropSpots.length;
      const answersLen = this.dropSpots[col].answers.length;
      return row !== undefined ? answersLen > 1 : dropSpotsLen > 2;
    },
    answerGroup(col) {
      return this.dropSpots[col].answers;
    },
    errorClass(col, row) {
      const answer = row === undefined
        ? `correct[${col}].heading`
        : `correct[${col}].answers[${row}]`;
      return { 'error': this.localErrors.includes(answer) };
    },
    flip(col, row = null) {
      if (this.isSelected(col, row)) {
        this.flipped = { col: null, row: null };
      } else {
        this.flipped = { col, row };
      }
    },
    isSelected(col, row = null) {
      return this.flipped.col === col && this.flipped.row === row;
    },
    removeAnswer(col, row) {
      this.answerGroup(col).splice(row, 1);
    },
    removeDropSpot(col) {
      this.dropSpots.splice(col, 1);
    },
    syncErrors() {
      if (!isEmpty(this.localErrors)) this.$emit('syncErrors');
    },
    update(message) {
      this.$emit('update', { correct: this.dropSpots });
    }
  },
  watch: {
    dropSpots: {
      handler() {
        this.update();
        this.syncErrors();
      },
      deep: true
    },
    errors() {
      this.localErrors = this.errors;
    }
  }
};
</script>

<style lang="scss" scoped>
.heading-box.flip,
.response-box.flip {
  transform: rotateX(180deg);
}

.error {
  border-bottom: 0;
  box-shadow: inset 0 -2px 0 #e51c23;
}

.disabled {
  pointer-events: none;
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
  }
}

.add-answer {
  margin-bottom: 25px;
}

.add-dropSpot {
  display: inline-block;
  font-size: 22px;
  float: right;
  width: 30%;
  margin-top: 141px;
}

.destroy {
  position: absolute;
  right: 11px;
  visibility: hidden;
  opacity: 0.5;
  border: 0;
  background-color: transparent;
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

.heading-box,
.response-box {
  position: relative;
  transition: 0.5s;
  transform-style: preserve-3d;
}

.heading-box {
  min-height: 52px;

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

  .response-view {
    background-color: rgb(217, 217, 217);
    border: 1px dashed rgb(89, 89, 89);
    padding: 11px 30px;

    .destroy {
      top: 12px;
    }
  }
}

.response-box:hover,
.heading-box:hover {
  .destroy {
    visibility: visible;
  }
}

.response-input,
.heading-input {
  min-height: inherit;
  position: absolute;
  backface-visibility: hidden;
  transform: rotateX( 180deg );
}
</style>
