<template>
  <div>
    <v-row>
      <v-col cols="4" offset="1">
        <v-text-field
          @change="updateHeading('premise', $event)"
          :value="headings.premise"
          :color="color"
          :disabled="disabled"
          :error="errors.includes('headings.premise')" />
      </v-col>
      <v-col cols="4" offset="2">
        <v-text-field
          @change="updateHeading('response', $event)"
          :value="headings.response"
          :color="color"
          :disabled="disabled"
          :error="errors.includes('headings.response')" />
      </v-col>
    </v-row>
    <v-row
      v-for="(responseKey, premiseKey) in correct"
      :key="responseKey"
      align="center">
      <v-col cols="4" offset="1">
        <v-text-field
          @change="updatePremiseContent(premiseKey, $event)"
          :value="getPremiseContent(premiseKey)"
          :color="color"
          :disabled="disabled"
          :placeholder="contentPlaceholder"
          :error="hasError(premiseKey, 'premises')"
          hide-details filled />
      </v-col>
      <v-col cols="2" class="text-center">
        <v-icon small>mdi-arrow-right</v-icon>
      </v-col>
      <v-col cols="4">
        <v-text-field
          @change="updateResponseContent(responseKey, $event)"
          :value="getResponseContent(responseKey)"
          :color="color"
          :disabled="disabled"
          :placeholder="contentPlaceholder"
          :error="hasError(responseKey, 'responses')"
          hide-details filled />
      </v-col>
      <v-col cols="1">
        <v-btn
          v-show="isEditing && pairsCount > 2"
          @click="removeItems(premiseKey, responseKey)"
          :disabled="disabled"
          small icon>
          <v-icon small>mdi-close</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <div class="d-flex justify-center my-2">
      <v-btn
        v-if="isEditing && pairsCount < 10"
        @click="addItems" icon>
        <v-icon>mdi-plus</v-icon>
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

const CONTENT_PLACEHOLDER = 'Insert text here...';

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
    contentPlaceholder: () => CONTENT_PLACEHOLDER,
    color: vm => vm.disabled ? 'grey' : 'blue-grey darken-3'
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
::v-deep input {
  text-align: center;
}
</style>
