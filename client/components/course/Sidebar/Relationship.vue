<template>
  <div class="relationship">
    <label :for="type">{{ label }}</label>
    <multiselect
      :value="associations"
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
import { getLevel, parseType } from 'shared/activities';
import { mapActions, mapGetters } from 'vuex-module';
import cloneDeep from 'lodash/cloneDeep';
import every from 'lodash/every';
import filter from 'lodash/filter';
import get from 'lodash/get';
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
    allowedTypes: { type: Array, default: () => ([]) }
  },
  computed: {
    ...mapGetters(['activity', 'activities'], 'course'),
    ...mapGetters(['getLineage'], 'activities'),
    options() {
      const { allowInsideLineage, allowCircularLinks, activity: { id } } = this;
      let activities = without(this.activities, this.activity);
      if (this.allowedTypes.length) {
        activities = filter(activities, activity => {
          const { typeName } = parseType(activity.type);
          return includes(this.allowedTypes, typeName);
        });
      }
      const conds = [it => getLevel(it.type)];
      if (!allowCircularLinks) conds.push(it => !includes(this.getAssociationIds(it), id));
      if (!allowInsideLineage) {
        const lineage = this.getLineage(this.activity);
        conds.push(it => !includes(lineage, it));
      }
      return filter(activities, it => every(conds, cond => cond(it)));
    },
    selectPlaceholder() {
      return isEmpty(this.options) ? 'No activities' : this.placeholder;
    },
    associations() {
      const ids = this.getAssociationIds(this.activity);
      return filter(this.options, it => includes(ids, it.id));
    },
    displayType() {
      return this.allowedTypes.length > 1;
    }
  },
  methods: {
    ...mapActions(['update'], 'activities'),
    getCustomLabel(activity) {
      const name = get(activity, 'data.name', '');
      const type = get(getLevel(activity.type), 'label');
      return !this.displayType ? name : `${name} (${type})`;
    },
    getAssociationIds(activity) {
      return get(activity, `refs.${this.type}`, []);
    },
    onRelationshipChanged(associations) {
      const ref = Array.isArray(associations)
        ? map(associations, 'id')
        : [get(associations, 'id')];
      let activity = cloneDeep(this.activity) || {};
      set(activity, `refs.${this.type}`, ref);
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
