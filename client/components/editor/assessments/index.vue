<template>
  <div class="assessment-container">
    <div class="assessment">
      <multiple-choice
        v-if="assessment.type === 'MC'"
        :assessment="assessment"
        @selected="$emit('selected')"
        @save="$emit('save', $event)">
      </multiple-choice>
      <single-choice
        v-if="assessment.type === 'SC'"
        :assessment="assessment"
        @selected="$emit('selected')"
        @save="$emit('save', $event)">
      </single-choice>
      <true-false
        v-if="assessment.type === 'TF'"
        :assessment="assessment"
        @selected="$emit('selected')"
        @save="$emit('save', $event)">
      </true-false>
      <numerical-response
        v-if="assessment.type === 'NR'"
        :assessment="assessment"
        @selected="$emit('selected')"
        @save="$emit('save', $event)">
      </numerical-response>
      <text-response
        v-if="assessment.type === 'TR'"
        :assessment="assessment"
        @selected="$emit('selected')"
        @save="$emit('save', $event)">
      </text-response>
      <fill-blank
        v-if="assessment.type === 'FB'"
        :assessment="assessment"
        @selected="$emit('selected')"
        @save="$emit('save', $event)">
      </fill-blank>
      <hotspot
        v-if="assessment.type === 'HS'"
        :assessment="assessment"
        @selected="$emit('selected')"
        @save="$emit('save', $event)">
      </hotspot>
    </div>
  </div>
</template>

<script>
import MultipleChoice from './MultipleChoice';
import SingleChoice from './SingleChoice';
import TrueFalse from './TrueFalse';
import NumericalResponse from './NumericalResponse';
import TextResponse from './TextResponse';
import FillBlank from './FillBlank';
import Hotspot from './Hotspot';

export default {
  name: 'assessment',
  props: { assessment: Object },
  components: {
    MultipleChoice,
    SingleChoice,
    TrueFalse,
    NumericalResponse,
    TextResponse,
    FillBlank,
    Hotspot
  }
};
</script>

<style lang="scss">
.assessment-container {
  cursor: default;
}
</style>
