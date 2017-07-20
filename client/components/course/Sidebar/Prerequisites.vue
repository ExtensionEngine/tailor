<template>
  <div class="prerequisites">
    <label for="prerequisites">Prerequisites</label>
    <multiselect
      :value="prerequisites"
      :options="options"
      :searchable="true"
      :multiple="true"
      :allowEmpty="true"
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
import includes from 'lodash/includes';
import intersectionWith from 'lodash/intersectionWith';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import { mapActions, mapGetters } from 'vuex-module';
import Select from '../../common/Select';
import set from 'lodash/set';
import without from 'lodash/without';

const getPrerequisites = activity => get(activity, 'refs.prerequisites', []);
const isPrerequisiteOf = (activity, other) => includes(getPrerequisites(other), activity.id);

export default {
  name: 'prerequisites',
  computed: {
    ...mapGetters(['activity', 'activities'], 'course'),
    ...mapGetters(['getLineage'], 'activities'),
    options() {
      const activities = without(this.activities, this.activity);
      const lineage = this.getLineage(this.activity);
      const isOutlineItem = it => getLevel(it.type);
      const isInsideLinenage = it => includes(lineage, it);
      return filter(activities, it => {
        return isOutlineItem(it) &&
          !isInsideLinenage(it) &&
          !isPrerequisiteOf(this.activity, it);
      });
    },
    placeholder() {
      return isEmpty(this.options) ? 'No activities' : 'Select prerequisites';
    },
    prerequisites() {
      const ids = getPrerequisites(this.activity);
      const comparator = (activity, id) => activity.id === id;
      return intersectionWith(this.options, ids, comparator);
    }
  },
  methods: {
    ...mapActions(['update'], 'activities'),
    onPrerequisitesChanged(prerequisites) {
      const activity = cloneDeep(this.activity) || {};
      set(activity, 'refs.prerequisites', map(prerequisites, 'id'));
      this.update(activity);
    }
  },
  components: { multiselect: Select }
};
</script>

<style lang="scss" scoped>
.prerequisites {
  margin-top: 40px;
  padding: 3px 8px;

  label {
    margin-bottom: 10px;
    color: #808080;
  }

  &:hover {
    cursor: pointer;
    background-color: #f5f5f5;
  }
}
</style>
