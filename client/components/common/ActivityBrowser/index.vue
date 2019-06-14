<template>
  <div class="activity-browser">
    <button
      @click="$emit('close')"
      class="btn btn-default btn-fab">
      <span class="mdi mdi-close"></span>
    </button>
    <select-repository
      v-if="!repository"
      @selected="selected => (repository = selected)">
    </select-repository>
    <select-activity
      v-else
      :repository="repository"
      :selectableLevels="selectableLevels"
      @reset="repository = null"
      @selected="activity => $emit('selected', activity)">
    </select-activity>
  </div>
</template>

<script>
import SelectActivity from './SelectActivity';
import SelectRepository from './SelectRepository';

export default {
  props: {
    selectableLevels: { type: Array, default: () => ([]) }
  },
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

<style lang="scss" scoped>
.activity-browser {
  width: 550px;
  margin: 25px auto;
  font-family: $font-family-secondary;
  color: #333;
}
</style>
