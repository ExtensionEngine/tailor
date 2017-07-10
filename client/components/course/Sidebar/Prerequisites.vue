<template>
  <div class="prerequisites">
    <label for="prerequisites">Prerequisites</label>
    <multiselect
      :value="prerequisites"
      :options="options"
      :searchable="true"
      :multiple="true"
      :disabled="!options.length"
      :placeholder="placeholder"
      @input="onPrerequisitesChanged"
      name="prerequisites"
      trackBy="id"
      label="name">
    </multiselect>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import filter from 'lodash/filter';
import get from 'lodash/get';
import { getLevel } from 'shared/activities';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import { mapActions, mapGetters } from 'vuex-module';
import Select from '../../common/Select';
import set from 'lodash/set';
import size from 'lodash/size';

export default {
  name: 'prerequisites',
  data() {
    return { prerequisites: [] };
  },
  computed: {
    ...mapGetters(['activity', 'activities'], 'course'),
    options() {
      const cond = it => getLevel(it.type) && it.id !== this.activity.id;
      return filter(this.activities, cond);
    },
    placeholder() {
      return isEmpty(this.options) ? 'No activities' : 'Select prerequisites';
    }
  },
  methods: {
    ...mapActions(['update'], 'activities'),
    onPrerequisitesChanged(prerequisites) {
      this.prerequisites = prerequisites;
      const activity = cloneDeep(this.activity) || {};
      set(activity, 'refs.prerequisiteIds', map(prerequisites, 'id'));
      this.update(activity);
    }
  },
  mounted() {
    const prerequisiteIds = get(this.activity, 'refs.prerequisiteIds');
    if (!size(prerequisiteIds)) return;
    this.prerequisites = filter(this.activities, it => prerequisiteIds.includes(it.id));
  },
  components: { multiselect: Select }
};
</script>

<style lang="scss" scoped>
.prerequisites {
  height: 96px;
  padding: 3px 8px;

  &:hover {
    cursor: pointer;
    background-color: #f5f5f5;
  }
}
</style>
