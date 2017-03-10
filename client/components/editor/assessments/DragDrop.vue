<template>
  <div class="dd-container">
    <div v-show="dropSpots.length !== 0" class="row">
      <div
        v-for="(dropSpot, index) in dropSpots"
        :class="fillSpace()"
        class="drop-spots col-md-6 col-sm-12">
        <transition name="fade" mode="out-in">
          <span
            v-if="elementsDisplay[index].display === 'view'"
            @click="toggleDisplay(index)"
            class="heading-box">
            <span
              :class="errorClass(index)"
              class="heading" >
              {{ dropSpot.heading }}
            </span>
            <span
              v-show="allowRemove(index)"
              @click.stop="removeDropSpot(index)"
              class="fa fa-times destroy">
            </span>
          </span>
          <input
            v-else="elementsDisplay[index].display === 'edit'"
            v-model="dropSpot.heading"
            v-focus
            @keyup.enter="toggleDisplay(index)"
            @keyup.esc="toggleDisplay(index)"
            @blur="elementsDisplay[index].display === 'edit'
              && toggleDisplay(index)"
            class="form-control heading-input"
            type="text">
        </transition>
        <ul>
          <li v-for="(answer, j) in answerGroup(index)">
            <transition name="fade" mode="out-in">
              <span
                v-if="elementsDisplay[index].items[j] === 'view'"
                @click.stop="toggleDisplay(index, j)"
                class="response-box">
                <span
                :class="errorClass(index, j)"
                class="response">
                {{ answer }}
              </span>
                <span
                  v-show="allowRemove(index, j)"
                  @click.stop="removeAnswer(index, j)"
                  class="fa fa-times destroy">
                </span>
              </span>
              <input
                v-else="elementsDisplay[index].items[j] === 'edit'"
                v-model="answerGroup(index)[j]"
                v-focus
                @keyup.esc="toggleDisplay(index, j)"
                @keyup.enter="toggleDisplay(index, j)"
                @blur="elementsDisplay[index].items[j] === 'edit'
                  && toggleDisplay(index, j)"
                class="form-control response-input"
                type="text">
            </transition>
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
    this.elementsDisplay.push({ display: 'view', items: ['view'] });
    this.elementsDisplay.push({ display: 'view', items: ['view'] });
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
      this.elementsDisplay[index].items.push('view');
      this.update();
    },
    addDropSpot() {
      this.assessment.correct.push({ heading: 'Drop spot', answers: ['Response item'] });
      this.elementsDisplay.push({ display: 'view', items: ['view'] });
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
        mode[j] === 'view' ? mode.splice(j, 1, 'edit') : mode.splice(j, 1, 'view');
        return;
      }
      let mode = this.elementsDisplay[index];
      mode.display === 'view' ? mode.display = 'edit' : mode.display = 'view';
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
      inserted: function (el) {
        el.focus();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.dd-container {
  overflow: hidden;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .17s
}
.fade-enter, .fade-leave-to {
  opacity: 0
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
    width: 100%;
    min-height: 52px;
    margin: 0 auto;
    display: table-cell;
    vertical-align: middle;
    overflow: hidden;
  }

  .heading-box {
    padding: 14px 26px;
    text-align: center;
    position: relative;
    display: table;
    background-color: rgb(238, 238, 238);
    border: 1px solid rgb(89, 89, 89);
    width: 100%;
    min-height: 52px;
    margin: 0 auto;

    .heading {
      display: inline-block;
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
    width: 100%;
    min-height: 46px;
  }

  .response-box {
    display: table;
    padding: 11px 26px;
    position: relative;
    background-color: rgb(217, 217, 217);
    border: 1px dashed rgb(89, 89, 89);
    width: 100%;
    min-height: 40px;

    .response {
      display: inline-block;
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

  .response-box:hover,
  .heading-box:hover {
    .destroy {
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
