<template>
  <div class="dd-container">
    <div v-show="dropSpots.length !== 0" class="row">
      <div
        v-for="(dropSpot, index) in dropSpots"
        :class="fillSpace()"
        class="drop-spots col-md-6 col-sm-12">
        <span
          @click="toggleDisplay(index)"
          :class="{'flip': elementsDisplay[index].flip === true}"
          class="heading-box flipper">
          <span
            :class="errorClass(index)"
            class="heading-view" >
            {{ dropSpot.heading }}
          </span>
          <span
            v-show="allowRemove(index)"
            @click.stop="removeDropSpot(index)"
            class="fa fa-times destroy">
          </span>
          <input
            v-model="dropSpot.heading"
            v-focus="elementsDisplay[index]"
            @click.stop=""
            @keyup.enter="toggleDisplay(index)"
            @keyup.esc="toggleDisplay(index)"
            @blur="elementsDisplay[index].flip === true
              && toggleDisplay(index)"
            class="form-control heading-input"
            type="text">
        </span>
        <ul>
          <li v-for="(answer, j) in answerGroup(index)">
            <span
              @click.stop="toggleDisplay(index, j)"
              :class="{'flip': elementsDisplay[index].items[j].flip === true}"
              class="response-box flipper">
              <span
              :class="errorClass(index, j)"
              class="response-view">
              {{ answer }}
              </span>
              <span
                v-show="allowRemove(index, j)"
                @click.stop="removeAnswer(index, j)"
                class="fa fa-times destroy">
              </span>
              <input
                v-model="answerGroup(index)[j]"
                v-focus="elementsDisplay[index].items[j]"
                @keyup.esc="toggleDisplay(index, j)"
                @keyup.enter="toggleDisplay(index, j)"
                @blur="elementsDisplay[index].items[j].flip === true
                  && toggleDisplay(index, j)"
                class="form-control response-input"
                type="text">
            </span>
          </li>
          <span
            @click="addAnswer(index)"
            class="fa fa-plus btn btn-link pull-center add-answer">
          </span>
        </ul>
      </div>
    </div>
    <div
      @click="addDropSpot()"
      class="fa fa-plus btn btn-link add-spot">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    assessment: Object,
    errors: Array,
    isEditing: Boolean
  },
  data() {
    return {
      elementsDisplay: []
    };
  },
  created() {
    if (this.assessment.correct.length < 2) {
      this.assessment.correct.push({ heading: 'Drop spot', answers: ['Response item'] });
      this.assessment.correct.push({ heading: 'Drop spot', answers: ['Response item'] });
    }
    this.elementsDisplay.push({ flip: false, items: [{ flip: false }] });
    this.elementsDisplay.push({ flip: false, items: [{ flip: false }] });
  },
  computed: {
    dropSpots() {
      return this.assessment.correct;
    }
  },
  methods: {
    update() {
      this.$emit('update', { correct: this.dropSpots });
    },
    answerGroup(index) {
      return this.assessment.correct[index].answers;
    },
    addAnswer(index) {
      this.answerGroup(index).push('Response item');
      this.elementsDisplay[index].items.push({ flip: false });
      this.update();
    },
    addDropSpot() {
      this.assessment.correct.push({ heading: 'Drop spot', answers: ['Response item'] });
      this.elementsDisplay.push({ flip: false, items: [{ flip: false }] });
      this.update();
    },
    removeAnswer(index, j) {
      this.answerGroup(index).splice(j, 1);
      this.elementsDisplay[index].items.splice(j, 1);
      this.update();
    },
    removeDropSpot(index) {
      this.assessment.correct.splice(index, 1);
      this.elementsDisplay.splice(index, 1);
      this.update();
    },
    allowRemove(index, j) {
      return j !== undefined
        ? this.dropSpots[index].answers.length > 1
        : this.dropSpots.length > 2;
    },
    toggleDisplay(index, j) {
      if (j !== undefined) {
        let mode = this.elementsDisplay[index].items;
        return mode[j].flip === false
          ? mode.splice(j, 1, { flip: true })
          : mode.splice(j, 1, { flip: false });
      }
      let mode = this.elementsDisplay[index];
      mode.flip === false
        ? mode.flip = true
        : mode.flip = false;
      return;
    },
    errorClass(groupIndex, answerIndex) {
      if (answerIndex === undefined) {
        const answer = `correct[${groupIndex}].heading`;
        return { 'error': this.errors.includes(answer) };
      }
      const answer = `correct[${groupIndex}].answers[${answerIndex}]`;
      return { 'error': this.errors.includes(answer) };
    },
    fillSpace() {
      return this.dropSpots.length === 2
        ? 'col-lg-6'
        : 'col-lg-4';
    }
  },
  watch: {
  },
  directives: {
    focus: {
      update(el, binding, vnode) {
        if (binding.value && binding.value.flip === true) el.focus();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.dd-container {
  overflow: hidden;
}

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

.row {
  width: 70%;
  padding-top: 63px;
  float: left;
  margin: 0;

  [class*="col-"] {
    padding: 0 0 0 15px;
    min-width: 226px;
  }
}

.drop-spots {
  display: inline-block;
  font-size: 16px;

  .add-answer {
    margin: 0 0 25px 0;
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      margin: 13px 0;
      width: 100%;
    }
  }
  .heading-input {
    min-height: 52px;
    position: absolute;
    top: 0;
    left: 0;
    display: table-cell;
    vertical-align: middle;
    overflow: hidden;
    backface-visibility: hidden;
    transform: rotateX( 180deg );
  }

  .heading-box {
    text-align: center;
    position: relative;
    display: table;
    width: 100%;
    min-height: 52px;
    margin: 0 auto;

    .heading-view {
      background-color: rgb(238, 238, 238);
      border: 1px solid rgb(89, 89, 89);
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      padding: 14px 26px;
      display: inline-block;
      backface-visibility: hidden;
      z-index: 2;
      /* for firefox 31 */
      transform: rotateX(0deg);
    }

    .destroy {
      position: absolute;
      top: 16px;
      right: 11px;
      visibility: hidden;
      opacity: 0.5;
      border: 0;
      background-color: transparent;
    }
  }

  .response-input {
    display: table-cell;
    vertical-align: middle;
    position: relative;
    width: 100%;
    min-height: 46px;
    backface-visibility: hidden;
    transform: rotateX( 180deg );
  }

  .response-box {
    display: table;
    width: 100%;
    min-height: 40px;

    .response-view {
      display: inline-block;
      backface-visibility: hidden;
      z-index: 2;
      position: absolute;
      top: 0;
      left: 0;
      background-color: rgb(217, 217, 217);
      border: 1px dashed rgb(89, 89, 89);
      width: 100%;
      height: 100%;
      padding: 11px 26px;
      /* for firefox 31 */
      transform: rotateX(0deg);
    }

    .destroy {
      position: absolute;
      top: 11px;
      right: 11px;
      visibility: hidden;
      opacity: 0.5;
      border: 0;
      background-color: transparent;
    }
  }

  .response-view:hover,
  .heading-view:hover {
    .destroy {
      z-index: 3;
      visibility: visible;
    }
  }
}

.add-spot {
  font-size: 22px;
  display: inline-block;;
  margin-top: 150px;
  margin-bottom: 120px;
  vertical-align: top;
}
</style>
