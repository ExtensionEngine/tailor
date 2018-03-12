<template>
  <div>
    <select-repository
      v-if="!repository"
      @selected="repository => (this.repository = repository)">
    </select-repository>
    <select-activity
      v-else
      :repository="repository"
      :levels="levels"
      @reset="repository = null"
      @selected="activity => $emit('selected', activity)">
    </select-activity>
  </div>
</template>

<script>
import SelectActivity from './SelectActivity';
import SelectRepository from './SelectRepository';

export default {
  props: ['levels'],
  data() {
    return {
      repository: null,
      activity: null
    };
  },
  components: {
    SelectActivity,
    SelectRepository
  }
};
</script>
