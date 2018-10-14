<template>
  <div class="relationship">
    <label :for="type">{{ label }}</label>
    <multiselect
      :value="relationship"
      :options="options"
      :searchable="searchable"
      :multiple="multiple"
      :allowEmpty="allowEmpty"
      :disabled="!options.length"
      :placeholder="selectPlaceholder"
      :customLabel="getCustomLabel"
      :name="type"
      @input="onRelationshipChanged"
      trackBy="id">
    </multiselect>
  </div>
</template>

<script>
import { getLevel } from 'shared/activities';
import { mapActions, mapGetters } from 'vuex-module';
import cloneDeep from 'lodash/cloneDeep';
import every from 'lodash/every';
import filter from 'lodash/filter';
import get from 'lodash/get';
import includes from 'lodash/includes';
import intersectionWith from 'lodash/intersectionWith';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import Select from '../../common/Select';
import set from 'lodash/set';
import without from 'lodash/without';

export default {
  name: 'relationship',
  props: {
    type: { type: String, required: true },
    label: { type: String, required: true },
    multiple: { type: Boolean, default: true },
    searchable: { type: Boolean, default: true },
    allowEmpty: { type: Boolean, default: true },
    placeholder: { type: String, default: 'Click to select' },
    allowCircularLinks: { type: Boolean, default: false },
    allowInsideLineage: { type: Boolean, default: false }
  },
  computed: {
    ...mapGetters(['activity', 'activities'], 'course'),
    ...mapGetters(['getLineage'], 'activities'),
    options() {
      const activities = without(this.activities, this.activity);
      return this.optionsGenerator(activities);
    },
    selectPlaceholder() {
      return isEmpty(this.options) ? 'No activities' : this.placeholder;
    },
    relationship() {
      const ids = this.getRelationships(this.activity);
      const comparator = (activity, id) => activity.id === id;
      return intersectionWith(this.options, ids, comparator);
    },
    lineage() {
      return this.getLineage(this.activity);
    },
    optionsGenerator() {
      const { allowInsideLineage, allowCircularLinks, lineage, activity: { id } } = this;
      const conds = [it => getLevel(it.type)];
      if (!allowInsideLineage) conds.push(it => !includes(lineage, it));
      if (!allowCircularLinks) conds.push(it => !includes(this.getRelationships(it), id));
      return options => filter(options, it => every(conds, cond => cond(it)));
    }
  },
  methods: {
    ...mapActions(['update'], 'activities'),
    getCustomLabel(activity) {
      return get(activity, 'data.name', '');
    },
    getRelationships(activity) {
      return get(activity, `refs.${this.type}`, []);
    },
    onRelationshipChanged(relationship) {
      const activity = cloneDeep(this.activity) || {};
      set(activity, `refs.${this.type}`, map(relationship, 'id'));
      this.update(activity);
    }
  },
  components: { multiselect: Select }
};
</script>

<style lang="scss" scoped>
.relationship {
  margin-top: 40px;
  padding: 3px 8px;

  label {
    margin-bottom: 10px;
    color: #808080;
  }

  &:hover {
    background-color: #f5f5f5;
    cursor: pointer;
  }
}
</style>
