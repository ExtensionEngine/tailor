<template>
  <li class="list-group-item assessment-item" @click="$emit('selected')">
    <assessment v-if="edit" :assessment="assessment"></assessment>
    <div v-else>
      <span class="label label-success">{{ assessment.type }}</span>
      <span class="title">{{ assessment.title }}</span>
    </div>
  </li>
</template>

<script>
import Assessment from '../assessments';

export default {
  name: 'assessment-item',
  props: ['assessment', 'edit'],
  components: {
    Assessment
  }
};
</script>

<style lang="scss" scoped>
.assessment-item {
  margin-bottom: 7px;

  &:hover {
    cursor: pointer;
  }

  .title {
    display: inline-block;
    height: 19px;
  }

  .label {
    float: left;
  }
}
</style>
