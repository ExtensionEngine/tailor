<template>
  <v-container :class="{ disabled: !isEditing }">
    <v-row>
      <v-col
        v-for="(groupName, groupKey, index) in groups"
        :key="groupKey"
        :class="{ clear: index % 2 === 0 }"
        cols="12"
        md="6"
        class="group">
        <div :class="{ flip: isFocused(groupKey) }" class="drop-container">
          <div @click="focus(groupKey)" class="group-view front center">
            <span :class="hasError(`groups${groupKey}`)">
              {{ groupName || (isEditing ? 'Click to edit group name' : 'Group') }}
            </span>
            <v-btn
              v-show="!minGroups(groupKey) && isEditing"
              @click.stop="removeGroup(groupKey)"
              icon
              small
              class="destroy">
              <v-icon small>mdi-close</v-icon>
            </v-btn>
          </div>
          <v-text-field
            v-focus="{ groupKey }"
            @change="updateGroupName(groupKey, $event)"
            @keyup.enter.esc="focus(groupKey)"
            @blur="isFocused(groupKey) && focus(groupKey)"
            :value="groupName"
            class="group-input back"
            placeholder="Insert text here ..." />
        </div>
        <ul>
          <li
            v-for="(answer, answerKey) in getGroupAnswers(groupKey)"
            :key="answerKey"
            :class="{ flip: isFocused(groupKey, answerKey) }"
            class="answer-container">
            <div
              @click="focus(groupKey, answerKey)"
              class="response-view front center">
              <span :class="hasError(`answers${answerKey}`)">
                {{ answer || (isEditing ? 'Click to edit answer' : 'Answer') }}
              </span>
              <v-btn
                v-show="!minAnswers(groupKey) && isEditing"
                @click.stop="removeAnswer(groupKey, answerKey)"
                icon
                small
                class="destroy">
                <v-icon small>mdi-close</v-icon>
              </v-btn>
            </div>
            <v-text-field
              v-focus="{ groupKey, answerKey }"
              @change="updateAnswer(answerKey, $event)"
              @keyup.enter.esc="focus(groupKey, answerKey)"
              @blur="isFocused(groupKey, answerKey) && focus(groupKey, answerKey)"
              :value="answer"
              class="response-input back"
              placeholder="Insert text here ..." />
          </li>
        </ul>
        <v-btn
          @click="addAnswer(groupKey)"
          icon
          small
          class="add-answer">
          <v-icon small>mdi-plus</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-btn @click="addGroup" small color="primary" class="add-group">
      <v-icon left small>mdi-plus</v-icon> Add Group
    </v-btn>
  </v-container>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import cuid from 'cuid';
import { defaults } from 'utils/assessment';
import forEach from 'lodash/forEach';
import pick from 'lodash/pick';
import pull from 'lodash/pull';

export default {
  props: {
    assessment: { type: Object, default: defaults.DD },
    isEditing: { type: Boolean, default: false },
    errors: { type: Array, default: () => ([]) }
  },
  data() {
    return {
      focused: { groupKey: null, answerKey: null }
    };
  },
  computed: {
    groups() {
      return this.assessment.groups || {};
    },
    answers() {
      return this.assessment.answers || {};
    },
    correct() {
      return this.assessment.correct || {};
    }
  },
  methods: {
    getGroupAnswers(groupKey) {
      let keys = this.correct[groupKey] || [];
      return pick(this.answers, keys);
    },
    updateGroupName(groupKey, value) {
      let groups = cloneDeep(this.groups);
      groups[groupKey] = value;
      this.update({ groups }, true);
    },
    updateAnswer(answerKey, value) {
      let answers = cloneDeep(this.answers);
      answers[answerKey] = value;
      this.update({ answers }, true);
    },
    addGroup() {
      let groups = cloneDeep(this.groups);
      let answers = cloneDeep(this.answers);
      let correct = cloneDeep(this.correct);
      const groupKey = cuid();
      const answerKey = cuid();
      groups[groupKey] = '';
      answers[answerKey] = '';
      correct[groupKey] = [answerKey];
      this.update({ groups, answers, correct });
    },
    addAnswer(groupKey) {
      let answers = cloneDeep(this.answers);
      let correct = cloneDeep(this.correct);
      const answerKey = cuid();
      answers[answerKey] = '';
      correct[groupKey].push(answerKey);
      this.update({ answers, correct });
    },
    minGroups(groupKey) {
      return Object.keys(this.groups).length <= 2;
    },
    minAnswers(groupKey) {
      return this.correct[groupKey].length <= 1;
    },
    focus(groupKey, answerKey) {
      this.focused = this.isFocused(groupKey, answerKey)
        ? {}
        : { groupKey, answerKey };
    },
    isFocused(groupKey, answerKey) {
      const state = this.focused;
      return state.groupKey === groupKey && state.answerKey === answerKey;
    },
    removeAnswer(groupKey, answerKey) {
      let answers = cloneDeep(this.answers);
      let correct = cloneDeep(this.correct);
      delete answers[answerKey];
      correct[groupKey] = pull(correct[groupKey], answerKey);
      this.update({ answers, correct });
    },
    removeGroup(groupKey) {
      let groups = cloneDeep(this.groups);
      let answers = cloneDeep(this.answers);
      let correct = cloneDeep(this.correct);
      forEach(correct[groupKey], answerKey => delete answers[answerKey]);
      delete groups[groupKey];
      delete correct[groupKey];
      this.update({ groups, answers, correct });
    },
    hasError(key) {
      return this.errors.includes(key) ? 'error' : '';
    },
    update(data) {
      this.$emit('update', data, true);
    }
  },
  directives: {
    focus: {
      update(el, binding, vnode) {
        const { groupKey, answerKey } = vnode.context.focused;
        const { groupKey: newGroupKey, answerKey: newAnswerKey } = binding.value;
        if (groupKey === newGroupKey && answerKey === newAnswerKey) {
          el.focus();
        } else {
          el.blur();
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.group {
  margin-top: 45px;
}

.add-group {
  margin-top: 80px;
  padding: 5px 20px;
}

.center {
  padding: 14px 21px;
}

.mdi:hover {
  color: #42b983;
  cursor: pointer;
}

.add-answer {
  font-size: 20px;
}

.destroy {
  position: absolute;
  right: 8px;
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

.group-view {
  background-color: rgb(217, 217, 217);
  border: 1px solid rgb(89, 89, 89);
  word-wrap: break-word;
}

.response-view {
  background-color: rgb(238, 238, 238);
  border: 1px dashed rgb(89, 89, 89);
  word-wrap: break-word;
}

.group-input, .response-input {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
}

ul {
  margin: 15px 0;
  padding: 0;
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

  .add-answer, .add-group {
    visibility: hidden;
  }
}

.clear {
  clear: left;
  margin-bottom: 10px;
}
</style>
