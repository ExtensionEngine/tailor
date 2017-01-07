<template>
  <div class="assessment-container">
    <div class="assessment">
      <multiple-choice v-if="assesment.type === 'MC'"></multiple-choice>
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
