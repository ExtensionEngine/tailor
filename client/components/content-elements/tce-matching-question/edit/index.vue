<template>
  <div :class="['matching-question', { disabled }]">
    <v-row justify="center">
      <v-col cols="1" />
      <v-col cols="4">
        <v-text-field
          @blur="e => updateHeading({ premise: e.target.value })"
          :error="errors.includes('headings.premise')"
          :value="headings.premise" />
      </v-col>
      <v-col cols="1" />
      <v-col cols="4">
        <v-text-field
          @blur="e => updateHeading({ response: e.target.value })"
          :error="errors.includes('headings.response')"
          :value="headings.response" />
      </v-col>
      <v-col cols="1" />
    </v-row>
    <v-row
      v-for="(responseKey, premiseKey) in correct"
      :key="responseKey"
      justify="center"
      align="end">
      <v-col cols="1" />
      <v-col cols="4">
        <v-text-field
          @change="updatePremiseContent(premiseKey, $event)"
          :value="getPremiseContent(premiseKey)"
          placeholder="Insert text here ..."
          hide-details />
      </v-col>
      <v-col cols="1">
        <v-icon small>mdi-arrow-right</v-icon>
      </v-col>
      <v-col cols="4">
        <v-text-field
          @change="updateResponseContent(responseKey, $event)"
          :value="getResponseContent(responseKey)"
          placeholder="Insert text here ..."
          hide-details />
      </v-col>
      <v-col cols="1">
        <v-btn
          v-show="!minItems && isEditing"
          @click="removeItems(premiseKey, responseKey)"
          :disabled="disabled"
          small icon tile>
          <v-icon small>mdi-close</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-show="!maxItems && isEditing" justify="center">
      <v-col cols="12" class="mt-2">
        <v-btn @click="addItems" :disabled="disabled" icon>
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import cuid from 'cuid';
import { defaults } from 'utils/assessment';
import find from 'lodash/find';
import keys from 'lodash/keys';
import pull from 'lodash/pull';
import shuffle from 'lodash/shuffle';

export default {
  props: {
    assessment: { type: Object, default: defaults.MQ },
    errors: { type: Array, default: () => ([]) },
    isEditing: { type: Boolean, default: false }
  },
  computed: {
    disabled: vm => !vm.isEditing,
    headings: vm => ({ premise: null, response: null, ...vm.assessment.headings }),
    premises: vm => vm.assessment.premises || {},
    responses: vm => vm.assessment.responses || {},
    correct: vm => vm.assessment.correct || {},
    maxItems: vm => keys(vm.correct).length >= 10,
    minItems: vm => keys(vm.correct).length <= 2
  },
  methods: {
    updateHeading(val) {
      this.update({ headings: { ...this.headings, ...val } });
    },
    updatePremiseContent(key, value) {
      const premises = cloneDeep(this.premises);
      this.getPremiseItem(key, premises).value = value;
      this.update({ premises: shuffle(premises) });
    },
    updateResponseContent(key, value) {
      const responses = cloneDeep(this.responses);
      this.getResponseItem(key, responses).value = value;
      this.update({ responses: shuffle(responses) });
    },
    getResponseContent(key) {
      return this.getResponseItem(key).value;
    },
    getPremiseContent(key) {
      return this.getPremiseItem(key).value;
    },
    getPremiseItem(key, premises = this.premises) {
      return find(premises, { key });
    },
    getResponseItem(key, responses = this.responses) {
      return find(responses, { key });
    },
    removeItems(premiseKey, responseKey) {
      const premises = cloneDeep(this.premises);
      const responses = cloneDeep(this.responses);
      const correct = cloneDeep(this.correct);
      pull(premises, this.getPremiseItem(premiseKey, premises));
      pull(responses, this.getResponseItem(responseKey, responses));
      delete correct[premiseKey];
      this.update({ premises, responses, correct });
    },
    addItems() {
      const premises = cloneDeep(this.premises);
      const responses = cloneDeep(this.responses);
      const correct = cloneDeep(this.correct);
      const premiseKey = cuid();
      const responseKey = cuid();
      premises.push({ key: premiseKey, value: '' });
      responses.push({ key: responseKey, value: '' });
      correct[premiseKey] = responseKey;
      this.update({
        premises: shuffle(premises),
        responses: shuffle(responses),
        correct
      });
    },
    update(data = {}) {
      this.$emit('update', data, true);
    },
    hasError(key, type) {
      const index = type === 'premises'
        ? this.premises.indexOf(this.getPremiseItem(key))
        : this.responses.indexOf(this.getResponseItem(key));
      const answer = `${type}[${index}].value`;
      return { error: this.errors.includes(answer) };
    }
  }
};
</script>

<style lang="scss" scoped>
.matching-question {
  text-align: center;

  ::v-deep input {
    text-align: center;
  }
}

.disabled {
  pointer-events: none;
}
</style>
