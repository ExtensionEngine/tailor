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

export default {
  name: 'prerequisites',
  computed: {
    ...mapGetters(['activity', 'activities'], 'course'),
    ...mapGetters(['getDescendants'], 'activities'),
    options() {
      return filter(this.activities, it => {
        return getLevel(it.type) &&
          it.id !== this.activity.id &&
          !includes(this.getDescendants(this.activity), it);
      });
    },
    placeholder() {
      return isEmpty(this.options) ? 'No activities' : 'Select prerequisites';
    },
    prerequisites() {
      const ids = get(this.activity, 'refs.prerequisites', []);
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
