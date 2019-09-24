<template>
  <div class="activity-browser">
    <v-btn @click="$emit('close')" fab>
      <span class="mdi mdi-close"></span>
    </v-btn>
    <select-repository
      v-if="!repository"
      @selected="selected => (repository = selected)" />
    <select-activity
      v-else
      @reset="repository = null"
      @selected="activity => $emit('selected', activity)"
      :repository="repository"
      :selectable-levels="selectableLevels" />
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

.v-btn.v-btn--fab {
  width: 48px;
  height: 48px;
}
</style>
