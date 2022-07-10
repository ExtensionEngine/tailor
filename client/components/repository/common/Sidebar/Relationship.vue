<template>
  <validation-provider
    ref="validator"
    v-slot="{ errors }"
    :rules="{ required: !allowEmpty }"
    :name="lowerCase(label)"
    immediate>
    <v-autocomplete
      @input="onRelationshipChanged"
      :value="value"
      :items="groupedOptions"
      :name="type"
      :label="label"
      :placeholder="selectPlaceholder"
      :multiple="multiple"
      :chips="multiple"
      :clearable="!multiple"
      :disabled="!options.length"
      :error-messages="errors"
      :class="{ required: !allowEmpty }"
      item-value="id"
      item-text="data.name"
      deletable-chips return-object outlined>
      <template #item="{ item }">
        <label-chip color="primary lighten-4" class="mr-2">{{ item.shortId }}</label-chip>
        {{ item.data.name }}
      </template>
    </v-autocomplete>
  </validation-provider>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import castArray from 'lodash/castArray';
import cloneDeep from 'lodash/cloneDeep';
import compact from 'lodash/compact';
import concat from 'lodash/concat';
import every from 'lodash/every';
import filter from 'lodash/filter';
import flatMap from 'lodash/flatMap';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import LabelChip from '../LabelChip.vue';
import lowerCase from 'lodash/lowerCase';
import map from 'lodash/map';
import pluralize from 'pluralize';
import set from 'lodash/set';
import without from 'lodash/without';

export default {
  name: 'activity-relationship',
  inject: ['$schemaService'],
  props: {
    activity: { type: Object, required: true },
    type: { type: String, required: true },
    label: { type: String, required: true },
    multiple: { type: Boolean, default: true },
    allowEmpty: { type: Boolean, default: true },
    placeholder: { type: String, default: 'Click to select' },
    allowCircularLinks: { type: Boolean, default: false },
    allowInsideLineage: { type: Boolean, default: false },
    allowedTypes: { type: Array, default: () => [] }
  },
  computed: {
    ...mapGetters('repository', ['outlineActivities']),
    ...mapGetters('repository/activities', ['getLineage']),
    value: vm => vm.multiple ? vm.associations : vm.associations[0],
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
        const schemaId = this.$schemaService.getSchemaId(this.activity.type);
        const allowedTypes = this.allowedTypes.map(type => `${schemaId}/${type}`);
        conds.push(({ type }) => includes(allowedTypes, type));
      }
      return filter(activities, it => every(conds, cond => cond(it)));
    },
    groupedOptions() {
      const grouped = groupBy(this.options, 'type');
      return flatMap(grouped, (it, type) => {
        const headerLabel = this.$schemaService.getLevel(type).label;
        return concat({ header: pluralize(headerLabel) }, it);
      });
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
    lowerCase,
    ...mapActions('repository/activities', ['update']),
    getAssociationIds(activity) {
      return get(activity, `refs.${this.type}`, []);
    },
    async onRelationshipChanged(value) {
      const { valid } = await this.$refs.validator.validate(value);
      if (!valid) return;
      const associations = compact(castArray(value));
      const activity = cloneDeep(this.activity) || {};
      set(activity, `refs.${this.type}`, map(associations, 'id'));
      this.update(activity);
    }
  },
  components: { LabelChip }
};
</script>

<style lang="scss" scoped>
::v-deep {
  .v-chip .v-chip__content {
    z-index: 0;
  }

  .v-list-item__content {
    flex: initial;
  }

  .v-list-item .v-list-item__action:first-child {
    margin-right: 1rem;
  }

  .v-input__slot .v-select__slot {
    .v-input__append-inner {
      margin-top: 1.375rem;
    }

    input[disabled] {
      opacity: 0.7;
      border-bottom: unset;
    }
  }
}
</style>
