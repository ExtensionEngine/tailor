<template>
  <div class="relationship">
    <label :for="type">{{ label }}</label>
    <multiselect
      @input="onRelationshipChanged"
      :value="multiple ? associations : associations[0]"
      :options="optionGroups"
      :searchable="searchable"
      :multiple="multiple"
      :allow-empty="allowEmpty"
      :disabled="!options.length"
      :placeholder="selectPlaceholder"
      :custom-label="getCustomLabel"
      :name="type"
      group-label="typeLabel"
      group-values="activities"
      track-by="id" />
  </div>
</template>

<script>
import { getLevel, getSchemaId } from 'shared/activities';
import { mapActions, mapGetters } from 'vuex';
import castArray from 'lodash/castArray';
import cloneDeep from 'lodash/cloneDeep';
import compact from 'lodash/compact';
import every from 'lodash/every';
import filter from 'lodash/filter';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import Select from '../../common/Select';
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
    ...mapGetters('repository', ['activity', 'outlineActivities']),
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
    optionGroups() {
      return map(groupBy(this.options, 'type'), (it, type) => ({
        typeLabel: getLevel(type).label,
        activities: it
      }));
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
    getCustomLabel(activity) {
      return get(activity, 'data.name', '');
    },
    getAssociationIds(activity) {
      return get(activity, `refs.${this.type}`, []);
    },
    onRelationshipChanged(value) {
      const associations = compact(castArray(value));
      const activity = cloneDeep(this.activity) || {};
      set(activity, `refs.${this.type}`, map(associations, 'id'));
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
