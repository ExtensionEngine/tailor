<template>
  <v-select
    @input="onRelationshipChanged"
    :value="multiple ? associations : associations[0]"
    :items="groupedOptions"
    :multiple="multiple"
    :allow-empty="allowEmpty"
    :disabled="!options.length"
    :placeholder="selectPlaceholder"
    :label="label"
    item-text="data.name"
    item-value="id"
    :name="type"
    chips
    deletable-chips
    box />
</template>

<script>
import { getLevel, getSchemaId } from 'shared/activities';
import { mapActions, mapGetters } from 'vuex';
import castArray from 'lodash/castArray';
import cloneDeep from 'lodash/cloneDeep';
import compact from 'lodash/compact';
import concat from 'lodash/concat';
import every from 'lodash/every';
import filter from 'lodash/filter';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import pluralize from 'pluralize';
import set from 'lodash/set';
import without from 'lodash/without';

export default {
  name: 'activity-relationship',
  props: {
    type: { type: String, required: true },
    label: { type: String, required: true },
    multiple: { type: Boolean, default: true },
    searchable: { type: Boolean, default: true },
    allowEmpty: { type: Boolean, default: true },
    placeholder: { type: String, default: 'Click to select' },
    allowCircularLinks: { type: Boolean, default: false },
    allowInsideLineage: { type: Boolean, default: false },
    allowedTypes: { type: Array, default: () => [] }
  },
  computed: {
    ...mapGetters('course', ['activity', 'outlineActivities']),
    ...mapGetters('activities', ['getLineage']),
    options() {
      const { allowInsideLineage, allowCircularLinks, activity: { id } } = this;
      const activities = without(this.outlineActivities, this.activity);
      const conds = [];
      if (!allowCircularLinks) conds.push(it => !includes(this.getAssociationIds(it), id));
      if (!allowInsideLineage) {
        const lineage = this.getLineage(this.activity);
        conds.push(it => !includes(lineage, it));
      }
      if (this.allowedTypes.length) {
        const schemaId = getSchemaId(this.activity.type);
        const allowedTypes = this.allowedTypes.map(type => `${schemaId}/${type}`);
        conds.push(({ type }) => includes(allowedTypes, type));
      }
      return filter(activities, it => every(conds, cond => cond(it)));
    },
    groupedOptions() {
      const grouped = groupBy(this.options, 'type');
      const withTypes = map(grouped, (it, type) => {
        const levelLabel = pluralize(getLevel(type).label);
        return concat({ header: levelLabel }, it);
      });
      let flatten = [];
      forEach(withTypes, it => flatten.push(...it));
      return flatten;
    },
    selectPlaceholder() {
      return isEmpty(this.options) ? 'No activities' : this.placeholder;
    },
    associations() {
      const ids = this.getAssociationIds(this.activity);
      return filter(this.options, it => includes(ids, it.id));
    }
  },
  methods: {
    ...mapActions('activities', ['update']),
    getAssociationIds(activity) {
      return get(activity, `refs.${this.type}`, []);
    },
    onRelationshipChanged(ids) {
      const value = ids.map(id => this.options.find(it => it.id === id));
      const associations = compact(castArray(value));
      let activity = cloneDeep(this.activity) || {};
      set(activity, `refs.${this.type}`, map(associations, 'id'));
      this.update(activity);
    }
  }
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
