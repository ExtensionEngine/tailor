<template>
  <div>
    <div class="subtitle-2 pb-2">Answers</div>
    <v-row>
      <v-col cols="4" offset="1">
        <v-text-field
          @change="updateHeading('premise', $event)"
          :value="headings.premise"
          :error-messages="headingErrors('premise')"
          :disabled="disabled"
          placeholder="Premise heading..."
          color="blue-grey darken-3"
          filled />
      </v-col>
      <v-col cols="4" offset="2">
        <v-text-field
          @change="updateHeading('response', $event)"
          :value="headings.response"
          :error-messages="headingErrors('response')"
          :disabled="disabled"
          placeholder="Response heading..."
          color="blue-grey darken-3"
          filled />
      </v-col>
    </v-row>
    <v-row v-for="(responseKey, premiseKey) in correct" :key="responseKey">
      <v-col cols="4" offset="1">
        <v-text-field
          @change="updatePremiseContent(premiseKey, $event)"
          :value="getPremiseContent(premiseKey)"
          :error-messages="answerErrors(premiseKey, 'premises')"
          :disabled="disabled"
          placeholder="Premise value..."
          color="blue-grey darken-3"
          filled />
      </v-col>
      <v-col cols="2" class="text-center">
        <v-icon small class="arrow">mdi-arrow-right</v-icon>
      </v-col>
      <v-col cols="4">
        <v-text-field
          @change="updateResponseContent(responseKey, $event)"
          :value="getResponseContent(responseKey)"
          :error-messages="answerErrors(responseKey, 'responses')"
          :disabled="disabled"
          placeholder="Response value..."
          color="blue-grey darken-3"
          filled />
      </v-col>
      <v-col cols="1">
        <v-btn
          v-show="isEditing && pairsCount > 2"
          @click="removeItems(premiseKey, responseKey)"
          :disabled="disabled"
          small icon
          class="remove">
          <v-icon small>mdi-close</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <div class="d-flex justify-center my-2">
      <v-btn
        v-if="isEditing && pairsCount < 10"
        @click="addItems"
        color="blue-grey darken-4"
        text
        class="px-2">
        <v-icon class="mr-2">mdi-plus</v-icon>
        Add pair
      </v-btn>
    </div>
  </div>
</template>

<script>
import { defaults, getErrorMessages } from 'utils/assessment';
import cloneDeep from 'lodash/cloneDeep';
import cuid from 'cuid';
import find from 'lodash/find';
import pull from 'lodash/pull';
import set from 'lodash/set';
import shuffle from 'lodash/shuffle';
import size from 'lodash/size';

export default {
  props: {
    assessment: { type: Object, default: defaults.MQ },
    errors: { type: Array, default: () => ([]) },
    isEditing: { type: Boolean, default: false }
  },
  computed: {
    disabled: vm => !vm.isEditing,
    correct: vm => vm.assessment.correct,
    headings: vm => vm.assessment.headings,
    premises: vm => vm.assessment.premises,
    responses: vm => vm.assessment.responses,
    pairsCount: vm => size(vm.correct)
  },
  methods: {
    updateHeading(key, value) {
      this.update({ headings: set({ ...this.headings }, key, value) });
    },
    getPremiseContent(key) {
      return this.getPremiseItem(key).value;
    },
    getResponseContent(key) {
      return this.getResponseItem(key).value;
    },
    getPremiseItem(key, premises = this.premises) {
      return find(premises, { key });
    },
    getResponseItem(key, responses = this.responses) {
      return find(responses, { key });
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
    removeItems(premiseKey, responseKey) {
      const premises = cloneDeep(this.premises);
      const responses = cloneDeep(this.responses);
      const correct = cloneDeep(this.correct);
      pull(premises, this.getPremiseItem(premiseKey, premises));
      pull(responses, this.getResponseItem(responseKey, responses));
      delete correct[premiseKey];
      this.update({ premises, responses, correct });
    },
    update(data = {}) {
      this.$emit('update', data);
    },
    headingErrors(type) {
      return getErrorMessages(this.errors, `headings.${type}`);
    },
    answerErrors(key, type) {
      const index = type === 'premises'
        ? this.premises.indexOf(this.getPremiseItem(key))
        : this.responses.indexOf(this.getResponseItem(key));
      return getErrorMessages(this.errors, `${type}[${index}]`);
    }
  }
};
</script>

<style lang="scss" scoped>
.arrow, .remove {
  position: relative;
  top: 1rem;
}

::v-deep input {
  text-align: center;
}
</style>
