<template>
  <div class="activity-browser">
    <button
      @click="$emit('close')"
      class="btn btn-default btn-fab">
      <span class="mdi mdi-close"></span>
    </button>
    <select-repository
      v-if="!currentRepository"
      @selected="selected => (currentRepository = selected)">
    </select-repository>
    <select-activity
      v-else
      :action="action"
      :repository="currentRepository"
      :selectableLevels="selectableLevels"
      @reset="currentRepository = null"
      @selected="activity => $emit('selected', activity)">
    </select-activity>
  </div>
</template>

<script>
import SelectActivity from './SelectActivity';
import SelectRepository from './SelectRepository';

export default {
  props: {
    action: { type: String, default: null },
    repository: { type: Object, default: null },
    selectableLevels: { type: Array, default: () => ([]) }
  },
  data() {
    return {
      activity: null,
      currentRepository: this.repository || null
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
