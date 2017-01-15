<template>
  <li class="list-group-item assessment-item">
    <assessment
      v-if="edit"
      :assessment="assessment"
      @selected="$emit('selected')"
      @save="$emit('save', $event)">
    </assessment>
    <div v-else @click="$emit('selected')">
      <span class="label label-success">{{ assessment.type }}</span>
      <span class="title">{{ assessment.question }}</span>
      <button
        class="delete"
        @click.stop="$emit('remove')"
        type="button">
        <span class="fa fa-times"></span>
      </button>
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
  padding: 0;

  div {
    padding: 15px;
  }

  &:hover {
    cursor: pointer;
  }

  .title {
    display: inline-block;
    height: 19px;
    max-width: 80%;
  }

  .label {
    float: left;
  }

  .delete {
    visibility: hidden;
    float: right;
    opacity: 0.5;
    border: 0;
    background-color: transparent;
    padding: 0;

    span {
      font-size: 20px;
    }
  }

  .delete:focus {
    outline: none;
  }

  div:hover {
    .delete:enabled {
      visibility: visible;
    }
  }
}
</style>
