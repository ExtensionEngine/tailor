<template>
  <div>
    <v-row>
      <v-col cols="4" offset="1">
        <v-text-field
          @change="updateHeading('premise', $event)"
          :value="headings.premise"
          :disabled="disabled"
          :placeholder="premisePlaceholder"
          :error="errors.includes('headings.premise')"
          color="blue-grey darken-3"
          filled />
      </v-col>
      <v-col cols="4" offset="2">
        <v-text-field
          @change="updateHeading('response', $event)"
          :value="headings.response"
          :disabled="disabled"
          :placeholder="responsePlaceholder"
          :error="errors.includes('headings.response')"
          color="blue-grey darken-3"
          filled />
      </v-col>
    </v-row>
    <v-row v-for="(responseKey, premiseKey) in correct" :key="responseKey">
      <v-col cols="4" offset="1">
        <v-text-field
          @change="updatePremiseContent(premiseKey, $event)"
          :value="getPremiseContent(premiseKey)"
          :disabled="disabled"
          :placeholder="contentPlaceholder"
          :error="hasError(premiseKey, 'premises')"
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
          :disabled="disabled"
          :placeholder="contentPlaceholder"
          :error="hasError(responseKey, 'responses')"
          color="blue-grey darken-3"
          filled />
      </v-col>
      <v-col cols="1">
        <v-btn
          v-show="isEditing && pairsCount > 2"
          @click="removeItems(premiseKey, responseKey)"
          :disabled="disabled"
          small icon class="remove">
          <v-icon small>mdi-close</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <div class="d-flex justify-center mt-4">
      <v-btn
        v-if="isEditing && pairsCount < 10"
        @click="addItems"
        color="blue-grey darken-3"
        text class="px-2">
        <v-icon>mdi-plus</v-icon>
        {{ addButtonLabel }}
      </v-btn>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import cuid from 'cuid';
import { defaults } from 'utils/assessment';
import find from 'lodash/find';
import pull from 'lodash/pull';
import set from 'lodash/set';
import shuffle from 'lodash/shuffle';
import size from 'lodash/size';

const PREMISE_PLACEHOLDER = 'Premise';
const RESPONSE_PLACEHOLDER = 'Response';
const CONTENT_PLACEHOLDER = 'Insert text here...';
const ADD_BUTTON_LABEL = 'Add correct pair';

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
    pairsCount: vm => size(vm.correct),
    premisePlaceholder: () => PREMISE_PLACEHOLDER,
    responsePlaceholder: () => RESPONSE_PLACEHOLDER,
    addButtonLabel: () => ADD_BUTTON_LABEL,
    contentPlaceholder: () => CONTENT_PLACEHOLDER
  },
  methods: {
    updateHeading(key, value) {
      this.update({ headings: set(cloneDeep(this.headings), key, value) });
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
      this.$emit('update', data, true);
    },
    hasError(key, type) {
      const index = type === 'premises'
        ? this.premises.indexOf(this.getPremiseItem(key))
        : this.responses.indexOf(this.getResponseItem(key));
      return this.errors.includes(`${type}[${index}].value`);
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
