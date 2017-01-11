<template>
  <div class="assessment-container">
    <div class="assessment">
      <multiple-choice
        v-if="assessment.type === 'MC'"
        :propAssessment="assessment"
        @selected="$emit('selected')"
        @saveAssessment="$emit('saveAssessment', $event)">
      </multiple-choice>
    </div>
  </div>
</template>

<script>
import MultipleChoice from './MultipleChoice';

export default {
  name: 'assessment',
  props: { assessment: Object },
  components: {
    MultipleChoice
  }
};
</script>
