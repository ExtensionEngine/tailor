<template>
  <li class="list-group-item">
    <div>
      <span class="label label-success">{{ assessment.type }}</span>
      <span>{{ assessment.title }}</span>
    </div>
  </li>
</template>

<script>
import Assessment from '../assessments';

export default {
  name: 'assessment-item',
  props: ['assessment'],
  components: {
    Assessment
  }
};
</script>
